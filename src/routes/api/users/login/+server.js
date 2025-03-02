import Stripe from 'stripe';
import { json } from '@sveltejs/kit';
import { PRIVATE_STRIPE_KEY } from '$env/static/private';
import { MongoDriver } from '$lib/server/db/driver.js';
import { JWTService } from '$lib/server/jwtService.js';

const stripe = new Stripe(PRIVATE_STRIPE_KEY);

export const POST = async ({ request, cookies }) => {
	const { email, password } = request.json();

	try {
		const mongo = new MongoDriver();

		// first, verify the username and password
		const user = await mongo.getUserByEmailAndPassword(email, password);

		// if the email and password are incorrect, then send back unauthorized
		if (!user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// if the user exists, create a jwt for the user data
		const token = JWTService.generateToken({ ...customer });

		// then, set an httpOnly cookie containing the user data
		cookies.set('auth_token', token, {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			path: '/',
			maxAge: 60 * 60 * 24 * 7 //7 days
		});

		return json({ message: 'Account Login Successful' });
	} catch (error) {
		return json({ error });
	}
};
