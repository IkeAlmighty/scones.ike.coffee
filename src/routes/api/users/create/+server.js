import { json } from '@sveltejs/kit';
import { User } from '$lib/server/models/User.js';
import { connectToDatabase } from '$lib/server/mongoose.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';

export const POST = async ({ request, cookies }) => {
	try {
		await connectToDatabase();

		const { phone, password, username } = await request.json();

		// create user:
		const user = new User({ phone, password, username });
		await user.save();

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

		return json({ message: 'user created and logged in.' });
	} catch (error) {
		console.log(error.message);
		return json({ error: error.message }, { status: 400 });
	}
};
