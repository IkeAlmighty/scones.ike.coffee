<script>
	import { PUBLIC_STRIPE_KEY } from '$env/static/public';
	import { onMount } from 'svelte';
	import { loadStripe } from '@stripe/stripe-js';
	import { goto } from '$app/navigation';

	export let cart;
	export let sideEffect = () => console.log('running side effect for submit order'); // used for sending confirmation emails, etc on success.

	let stripe;
	let elements;
	let cardElement;
	let clientSecret = '';
	let currency = 'usd';

	onMount(async () => {
		stripe = await loadStripe(PUBLIC_STRIPE_KEY);

		elements = stripe.elements();

		cardElement = elements.create('card');
		cardElement.mount('#card-element');
	});

	async function handleSubmit(event) {
		event.preventDefault();

		try {
			const res = await fetch('/api/create-payment-intent', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ cart, currency }) //TODO: replace with stringifiedCart (need to edit backend as well)
			});

			const data = await res.json();
			clientSecret = data.clientSecret;

			//confirm payment with card element and client secret:

			const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
				payment_method: {
					card: cardElement
				}
			});

			if (error) {
				console.log(error.message);
			} else if (paymentIntent.status === 'succeeded') {
				sideEffect(event);
				console.log('payment succeeded'); //TODO: replace with redirect to success page
			}
		} catch (err) {
			console.error('payment failed'); //TODO: replace with user toast notification
		}
	}
</script>

<form on:submit={handleSubmit}>
	<div id="card-element"></div>
	<button type="submit">Submit Scone Order</button>
</form>

<style>
	form {
		margin: 1rem 0;
	}

	#card-element {
		margin: 1rem 0;
		padding: 0.5rem;
		border: 1px solid black;
	}

	button {
		padding: 0.5rem;
		font-size: 1.5rem;
		border-radius: 5px;
	}
</style>
