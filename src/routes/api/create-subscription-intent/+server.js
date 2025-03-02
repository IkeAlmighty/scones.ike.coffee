import Stripe from 'stripe';
import { json } from '@sveltejs/kit';
import { PRIVATE_STRIPE_KEY } from '$env/static/private';
import { validatePaymentAmount } from '$lib/utils';
import { JWTService } from '$lib/server/jwtService';

const stripe = new Stripe(PRIVATE_STRIPE_KEY);

export const POST = async ({ request, locals }) => {
	try {

		const user = JWTService.verifyToken(locals.user)
		const { stripeCustomerId } = user;
		const { name, address, cart, currency, amount, interval } = await request.json();

		if (!validatePaymentAmount(cart, amount)) throw Error({ message: 'invalid payment amount.' });

		// first, create a new price (for this custom subscription)
		const price = await stripe.prices.create({
			unit_amount: amount,
			currency,
			recurring: { interval },
			product_data: {
				name: `Custom Subscription for ${name}`
			}
		});

		// then, check to see if a customer exists under the email & phone:
		const customer = await stripe.customers.retrieve(stripeCustomerId);

		// if the customer does not exist then throw error
		if (!customer) throw new Error('Customer does not exist.');

		const subscription = await stripe.subscriptions.create({
			customer: customer.id,
			items: [{ price: price.id }],
			metadata: {
				name,
				address,
				phone
			},
			expand: ['latest_invoice.payment_intent']
		});

		return json({ subscription });
	} catch (error) {
		console.log(error.message);
		return json({ error: error.message }, { status: 400 });
	}
};
