import Stripe from 'stripe';
import { json } from '@sveltejs/kit';
import { PRIVATE_STRIPE_KEY } from '$env/static/private';
import { calcSuggestedPayment } from '$lib/utils';

const stripe = new Stripe(PRIVATE_STRIPE_KEY);

export const POST = async ({ request }) => {
    try {
        const { cart, currency } = await request.json();

        const amount = calcSuggestedPayment(cart) * 100;

        // Create a payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount,  // Amount in the smallest currency unit (e.g., cents)
            currency,  // Currency (e.g., 'usd')
            confirmation_method: 'automatic',
        });

        return json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        return json({ error: error.message }, { status: 400 });
    }
}