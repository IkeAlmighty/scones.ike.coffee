import mongoose from 'mongoose';
import Message from '$lib/server/models/Message.js';
import { xml } from '@sveltejs/kit'; // for TwiML response
import { connectToDatabase } from '$lib/server/utils/mongoose.js';
import { ADMIN_NUMBER } from '$env/static/private';
import { User } from '$lib/server/models/User.js';

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
			body,
			direction: 'inbound'
		});

		console.log(`✅ Stored inbound SMS from ${from}`);

		// notify me:
		const user = await User.findOne({ phone: from });
		const message = await client.messages.create({
			body: `${user ? user.username : from} sent a message. https://scones.ike.coffee/account/admin`,
			from: TWILIO_NUMBER,
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
