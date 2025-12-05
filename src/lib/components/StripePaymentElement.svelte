<script>
	import { PUBLIC_STRIPE_KEY } from '$env/static/public';
	import { onMount } from 'svelte';
	import { loadStripe } from '@stripe/stripe-js';
	import { goto } from '$app/navigation';
	import { calcSuggestedPayment, calcMinSuggestedPayment } from '$lib/utils';

	export let cart;
	export let sideEffect = () => console.log('running side effect for submit order'); // used for sending confirmation emails, etc on success.

	let stripe;
	let elements;
	let cardElement;
	let clientSecret = '';
	let currency = 'usd';

	let isProcessing = false;
	let errorMessage = '';

	$: min = calcMinSuggestedPayment(cart);
	$: max = calcSuggestedPayment(cart) * 2.5;

	let paymentTotalSelected = calcSuggestedPayment(cart);

	onMount(async () => {
		stripe = await loadStripe(PUBLIC_STRIPE_KEY);

		elements = stripe.elements();

		cardElement = elements.create('card');
		cardElement.mount('#card-element');
	});

	async function handleSubmit(event) {
		event.preventDefault();
		isProcessing = true;

		try {
			const res = await fetch('/api/create-payment-intent', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ cart, currency, amount: paymentTotalSelected * 100 })
			});

			const data = await res.json();
			clientSecret = data.clientSecret;

			// confirm payment with card element and client secret:

			const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
				payment_method: {
					card: cardElement
				}
			});

			if (error) {
				console.log(error.message);
				errorMessage = error.message;
			} else if (paymentIntent.status === 'succeeded') {
				sideEffect(event);
				console.log('payment succeeded');
			}
		} catch (err) {
			console.error('payment failed'); //TODO: replace with user toast notification
		} finally {
			isProcessing = false;
		}
	}
</script>

<form on:submit={handleSubmit}>
	<input type="range" {min} {max} bind:value={paymentTotalSelected} step={0.25} />

	<div class="text-center">
		${paymentTotalSelected.toFixed(2)}
		{#if paymentTotalSelected === 0.5}
			<div class="danger-italic font-sm">the payment processing provider has a $0.50 minimum</div>
		{/if}
	</div>
	<div id="card-element"></div>

	{#if errorMessage}
		<div class="danger-italic font-sm">{errorMessage}</div>
	{/if}

	<button type="submit" disabled={isProcessing}>
		{#if isProcessing}
			Processing...
		{:else}
			Submit Scone Order
		{/if}
	</button>
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

	input[type='range'] {
		width: 100%;
	}
</style>
