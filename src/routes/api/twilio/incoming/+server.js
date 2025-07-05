import mongoose from 'mongoose';
import Message from '$lib/server/models/Message.js';
import twilio from 'twilio';
import { xml } from '@sveltejs/kit'; // for TwiML response
import { connectToDatabase } from '$lib/server/utils/mongoose.js';
import { ADMIN_NUMBER, TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_NUMBER } from '$env/static/private';
import { User } from '$lib/server/models/User.js';
import { createAndSendMessage } from '$lib/server/controllers/messages.js';

const client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

export async function POST({ request }) {
	await connectToDatabase();

	const formData = await request.formData();

	const from = formData.get('From');
	const to = formData.get('To');
	const body = formData.get('Body');

	try {
		await Message.create({
			from,
			to,
			body
		});

		console.log(`✅ Stored inbound SMS from ${from}`);

		// notify admin:
		let user = await User.findOne({ phone: from });

		// if the user does not exist, create it with just the phone number field:
		if (!user) {
			user = await User.create({ phone: from, notificationConsent: false });
		}

		const isStopRequest = body.toLowerCase() === 'stop';
		const isStartRequest = body.toLowerCase() === 'start';
		let adminMessage = `${user ? user.username : from} sent a message. https://scones.ike.coffee/account/admin?user=${user.id}`;

		// disable textConsent if message contains 'STOP'
		if (isStopRequest) {
			// reset admin message:
			adminMessage = `${user.username || user.phone} has stopped notifications. May they have peace and quiet :)`;

			user.notificationConsent = false;
			await user.save();

			await createAndSendMessage({
				body: '${user.username} have unsubscribed from sconifications.',
				to: ADMIN_NUMBER
			});
		}

		// enable text consent if message contains 'START'
		if (isStartRequest) {
			// reset admin message:
			adminMessage = `${user.username || user.phone} has started text notifications! https://scones.ike.coffee/account/admin?user=${user.id}`;

			user.notificationConsent = true;
			await user.save();

			await createAndSendMessage({
				body: '${user.username} has subscribed to sconifications!',
				to: ADMIN_NUMBER
			});
		}

		// send the notification message to admin
		await createAndSendMessage({
			body: adminMessage,
			to: ADMIN_NUMBER
		});

		// Respond with empty TwiML (Twilio requires valid response)
		return new Response(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`, {
			headers: { 'Content-Type': 'text/xml' }
		});
	} catch (err) {
		console.error('❌ Error saving message:', err);
		return new Response('Server error', { status: 500 });
	}
}
