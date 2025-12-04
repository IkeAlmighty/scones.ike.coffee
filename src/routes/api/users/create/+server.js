import { json } from '@sveltejs/kit';
import { User } from '$lib/server/models/User.js';
import { connectToDatabase } from '$lib/server/utils/mongoose.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { ADMIN_NUMBER, JWT_SECRET } from '$env/static/private';
import { createAndSendMessage } from '$lib/server/controllers/messages.js';
import { getReferralLinkFromId } from '$lib/utils.js';

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
			return json({ error: `${phoneWithCountryCode} already exists.` }, { status: 400 });
		}

		// create user:
		let userData = { phone: phoneWithCountryCode, username, notificationConsent };
		let referralUser;
		if (password) userData.password = password;
		if (referralId) {
			userData.referral = referralId;
			referralUser = await User.findById(referralId);
			const totalReferrals = (
				await User.find({ referral: new mongoose.Types.ObjectId(referralId) }).lean()
			).length;
			await createAndSendMessage({
				to: referralUser.phone,
				body: `${username} has signed up for sconifications. You have accumulated ${totalReferrals * 2} free scones :3`
			});
		}

		const user = new User(userData);
		await user.save();

		// send an onboarding message for sconifications:
		if (user.notificationConsent) {
			const body = `
Welcome to SCONIFICATIONS. You can stop recieving sconifications at any time by texting STOP.\n\n
Send this referral link to your friends to get free scones at my next sale: ${getReferralLinkFromId(user.id)}
`;
			await createAndSendMessage({ to: user.phone, body });
			await createAndSendMessage({
				to: ADMIN_NUMBER,
				body: `${user.username} signed up for sconifications ${referralUser ? '. Referred by ' + referralUser.username : ''}.`
			});
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
