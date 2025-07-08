import twilio from 'twilio';
import { json } from '@sveltejs/kit';
import { TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_NUMBER } from '$env/static/private';
import { User } from '$lib/server/models/User.js';
import Message from '$lib/server/models/Message.js';
import { getReferralLinkFromId } from '$lib/utils.js';

const client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

export async function POST({ request, locals }) {
	const data = await request.json();
	const { sendToAll } = data;
	let numbers = sendToAll ? undefined : data.numbers;
	let consentingUsers;

	// abort if the account does not have privilages to send messages:
	if (!locals.user?.isAdmin) {
		return json({ error: 'Only admins can send twilio messages' }, { status: 401 });
	}

	// if sendToAll was enabled, then go ahead and grab all the applicable
	// account numbers in the database.
	if (sendToAll) {
		consentingUsers = await User.find({ notificationConsent: true });
	} else {
		consentingUsers = await User.find({
			phone: { $in: numbers },
			notificationConsent: true
		});
	}

	const sidList = [];

	for (let user of consentingUsers) {
		try {
			const body = `
Your referral link (ignore if you already recieved yours):\n\n
${getReferralLinkFromId(user.id)}\n\n
For every friend that signs up via this link you get 2 free scones at my next sale :)\n\n
      `;

			const message = await client.messages.create({
				body,
				from: TWILIO_NUMBER,
				to: user.phone
			});

			sidList.push(message.sid);

			// update database as well:
			await Message.create({ from: TWILIO_NUMBER, to: user.phone, body });

			console.log(`sent link for ${user.username}`);
		} catch (err) {
			console.error('❌ Twilio send error:', err);
		}
	}

	return json({ sidList });
}
