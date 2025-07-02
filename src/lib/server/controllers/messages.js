import { TWILIO_NUMBER } from '$env/static/private';
import Message from '$lib/server/models/Message.js';
import { formatPhoneNumber } from '$lib/utils.js';
import { connectToDatabase } from '$lib/server/utils/mongoose.js';

/**
 *
 * @param {phone number} recipient
 * @param {string} body
 */
export async function createAndSendMessage({ to, body }) {
	let recipientFormatted = formatPhoneNumber(to);
	try {
		await connectToDatabase();

		// add message to database
		await Message.create({
			from: TWILIO_NUMBER,
			to: recipientFormatted,
			body
		});

		// send message to recipient with twilio
		await client.messages.create({
			body,
			from: TWILIO_NUMBER,
			to: recipientFormatted
		});

		console.log(`✅ Stored inbound SMS from admin to ${recipientFormatted}`);
	} catch (err) {
		console.log(err);
	}
}
