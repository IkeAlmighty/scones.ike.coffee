import mongoose from 'mongoose';
import Message from '$lib/server/models/Message.js';
import { xml } from '@sveltejs/kit'; // for TwiML response
import { connectToDatabase } from '$lib/server/utils/mongoose.js';

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

		console.log(`✅ Stored inbound SMS from ${from}: ${body}`);

		// Respond with empty TwiML (Twilio requires valid response)
		return new Response(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`, {
			headers: { 'Content-Type': 'text/xml' }
		});
	} catch (err) {
		console.error('❌ Error saving message:', err);
		return new Response('Server error', { status: 500 });
	}
}
