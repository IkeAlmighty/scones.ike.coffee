import Stripe from 'stripe';
import { json } from '@sveltejs/kit';
import { PRIVATE_STRIPE_KEY } from '$env/static/private';
import { validatePaymentAmount } from '$lib/utils';

const stripe = new Stripe(PRIVATE_STRIPE_KEY);

export const POST = async ({ request }) => {
    try {
        const { cart, currency, amount } = await request.json();

        if (!validatePaymentAmount(cart, amount)) throw Error({ message: 'invalid payment amount.' })

        // Create a payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount,  // Amount in the smallest currency unit (e.g., cents)
            currency,  // Currency (e.g., 'usd')
        });

        return json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.log(error.message)
        return json({ error: error.message }, { status: 400 });
    }
}