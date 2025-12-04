import { json } from '@sveltejs/kit';
import { GOOGLE_APP_PASSWORD } from '$env/static/private';
import { GOOGLE_APP_USER } from '$env/static/private';
import nodemailer from 'nodemailer';

import twilio from 'twilio';
import { PICKUP_ADDRESS } from '$env/static/private';
import { TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_NUMBER } from '$env/static/private';
import Message from '$lib/server/models/Message.js';

const client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

export async function POST({ request }) {
	const { message, phone, cart, delivering, deliveryDate } = await request.json();

	// send email to myself:
	const transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 587,
		secure: false,
		auth: {
			user: GOOGLE_APP_USER,
			pass: GOOGLE_APP_PASSWORD
		}
	});

	const options = {
		from: GOOGLE_APP_USER,
		to: GOOGLE_APP_USER,
		subject: `ORDER: ${message.slice(0, 10) || ''}-${Date.now().toString().slice(5)}`,
		text: message
	};

	await new Promise((resolve, reject) =>
		transporter.sendMail(options, (err, info) => {
			if (err) {
				console.error('Error', err);
				reject(err);
			} else {
				console.log('Email Sent', info.response);
				resolve(info);
			}
		})
	);

	// send SMS to customer:
	let smsMessage = 'Your Order:\n' + cart;

	if (!delivering) {
		smsMessage += `\n\nThe pickup address is ${PICKUP_ADDRESS}.`;
	}

	smsMessage += `\n\n${delivering ? 'Delivery' : 'Pickup'} date: ${new Date(deliveryDate).toLocaleDateString()}. ${!delivering ? 'Swing by anytime between 10am and 2pm.' : ''} \n\nThanks for your order!`;

	try {
		await client.messages.create({
			body: smsMessage,
			from: TWILIO_NUMBER,
			to: phone
		});
	} catch (err) {
		console.error('❌ Twilio send error:', err);
	}

	try {
		await Message.create({
			from: TWILIO_NUMBER,
			to: phone,
			body: smsMessage
		});
	} catch (err) {
		console.error('❌ Message DB log error:', err);
	}

	return json({ status: 200 });
}
