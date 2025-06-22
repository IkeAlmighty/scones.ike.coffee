import twilio from 'twilio';
import { json } from '@sveltejs/kit';
import { TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_NUMBER } from '$env/static/private';

const client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

export async function POST({ request, locals }) {
	const { to, body } = await request.json();

	// abort if the account does not have privilages to send messages:
	console.log(locals);
	if (!locals.user?.isAdmin) {
		console.log('not admin!');
		return json({ error: 'Only admins can send twilio messages' }, { status: 401 });
	}

	try {
		const message = await client.messages.create({
			body,
			from: TWILIO_NUMBER,
			to
		});

		return json({ sid: message.sid });
	} catch (err) {
		console.error('❌ Twilio send error:', err);
		return json({ error: err.message }, { status: 500 });
	}
}
