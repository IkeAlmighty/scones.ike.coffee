import Stripe from 'stripe';
import { json } from '@sveltejs/kit';
import { PRIVATE_STRIPE_KEY } from '$env/static/private';
import { MongoDriver } from '$lib/server/db/driver.js';
import { JWTService } from '$lib/server/jwtService.js';

const stripe = new Stripe(PRIVATE_STRIPE_KEY);

export const POST = async ({ request, cookies }) => {
	const { name, phone, password, email } = request.json();

	try {
		// first, create the customer in stripe database
		const customerStripe = await stripe.customers.create({
			name,
			phone,
		});

		// then, create the user in scones.ike.coffee database
		const customer = { email, name, phone, password, stripeCustomerId: customerStripe.id };

		const driver = await new MongoDriver();
		await driver.connect();
		const _id = await driver.createUser(customer);

		delete customer.password; // remove the unhashed password from the user object that's being stored in a jwt in a cookie

		// create a jwt for the user data
		const token = JWTService.generateToken({ ...customer, _id });

		// then, set an httpOnly cookie containing the user data
		cookies.set('auth_token', token, {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			path: '/',
			maxAge: 60 * 60 * 24 * 7 // 7 days
		});

		return json({ message: 'Account Creation & Login Successful' });

		// then return 200
	} catch (error) {
		return json({ error });
	}
};
