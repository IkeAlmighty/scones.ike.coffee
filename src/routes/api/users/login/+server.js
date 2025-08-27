import { json } from '@sveltejs/kit';
import { User } from '$lib/server/models/User.js';
import { connectToDatabase } from '$lib/server/utils/mongoose.js';
import { JWT_SECRET } from '$env/static/private';
import jwt from 'jsonwebtoken';

export const POST = async ({ request, cookies }) => {
	try {
		await connectToDatabase();

		const { phone, password } = await request.json();

		if (!phone || !password) {
			return json({ error: 'missing either phone or password' }, { status: 400 });
		}

		let phoneWithCountryCode = phone;

		// if the phone doesn't include the country number, then just add united states code (my customers are in MN)
		if (phone.length === 10) phoneWithCountryCode = `+1${phone}`;

		const user = await User.findOne({ phone: phoneWithCountryCode });

		if (user && (await user.isValidPassword(password))) {
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
				sameSite: 'lax',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 7 // 7 days
			});

			return json({ message: 'user logged in successfully!' });
		}
	} catch (error) {
		console.log(error.message);
		return json({ error: error.message }, { status: 400 });
	}
};
