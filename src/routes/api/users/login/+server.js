import { json } from '@sveltejs/kit';
import { User } from '$lib/server/models/User.js';
import { connectToDatabase } from '$lib/server/utils/mongoose.js';
import { JWT_SECRET } from '$env/static/private';
import jwt from 'jsonwebtoken';

export const POST = async ({ request, cookies }) => {
	try {
		await connectToDatabase();

		const { phone, password } = await request.json();

		const user = await User.findOne({ phone });

		if (user && user.isValidPassword(password)) {
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

			return json({ message: 'user logged in successfully!' });
		}
	} catch (error) {
		console.log(error.message);
		return json({ error: error.message }, { status: 400 });
	}
};
