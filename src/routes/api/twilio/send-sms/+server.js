import twilio from 'twilio';
import { json } from '@sveltejs/kit';
import { TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_NUMBER } from '$env/static/private';
import { User } from '$lib/server/models/User.js';
import Message from '$lib/server/models/Message.js'

const client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

export async function POST({ request, locals }) {
	const data = await request.json();
	const { body, sendToAll } = data;
	let numbers = sendToAll ? undefined : data.numbers;

	// abort if the account does not have privilages to send messages:
	if (!locals.user?.isAdmin) {
		return json({ error: 'Only admins can send twilio messages' }, { status: 401 });
	}

	// if sendToAll was enabled, then go ahead and grab all the applicable
	// account numbers in the database.
	if (sendToAll) {
		let consentingUsers = await User.find({ notificationConsent: true });
		numbers = consentingUsers.map((user) => user.phone);
	}

	try {
		const sidList = [];

		for (let recipient of numbers) {
			const message = await client.messages.create({
				body,
				from: TWILIO_NUMBER,
				to: recipient
			});

			sidList.push(message.sid);

			// update database as well:
			await Message.create({ from: TWILIO_NUMBER, to: recipient, body, direction: 'outbound' })
		}

		return json({ sidList });
	} catch (err) {
		console.error('❌ Twilio send error:', err);
		return json({ error: err.message }, { status: 500 });
	}
}
