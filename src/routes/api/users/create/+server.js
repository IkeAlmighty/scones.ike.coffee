import { json } from '@sveltejs/kit';
import { User } from '$lib/server/models/User.js';
import { connectToDatabase } from '$lib/server/utils/mongoose.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { createAndSendMessage } from '$lib/server/controllers/messages.js';

export const POST = async ({ request, cookies }) => {
	try {
		await connectToDatabase();

		const { phone, password, username, notificationConsent, referralId } = await request.json();

		if (!phone || !username || !notificationConsent) {
			throw new Error('Not all required fields were filled out.');
		}

		// if the phone doesn't include the country number, then just add united states code (my customers are in MN)
		let phoneWithCountryCode = phone;
		if (phone.length === 10) phoneWithCountryCode = parseInt(`1${phone}`);

		// check to see if user exists already, if so then abort and send an error message:
		const exists = await User.findOne({ phone: parseInt(phoneWithCountryCode) });
		if (exists) {
			return json({ error: `${phoneWithCountryCode} is already exists.` }, { status: 400 });
		}

		// create user:
		let userData = { phone: phoneWithCountryCode, username, notificationConsent };
		if (password) userData.password = password;
		if (referralId) userData.referral = referralId;

		const user = new User(userData);
		await user.save();

		// send an onboarding message for sconifications:
		if (user.notificationConsent) {
			const body = `
Hi, this is ike! I'll be sending SCONIFICATIONS (scone notifications) from this phone #.\n\n
You can stop recieving sconifications at any time by texting STOP.`;
			await createAndSendMessage({ to: user.phone, body });
		}

		// if the user created a password as well, then go ahead and log them in
		if (user.password) {
			// create jwt and store in httpOnly cookie:
			const token = jwt.sign(
				{ id: user.id },
				JWT_SECRET,
				{ expiresIn: '7d' } // Example: token valid for 7 days
			);

			// Set httpOnly cookie
			cookies.set('authToken', token, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 7 // 7 days
			});
		}

		return json({ message: 'user created.' });
	} catch (error) {
		console.log(error.message);
		return json({ error: 'Server side error' }, { status: 500 });
	}
};
