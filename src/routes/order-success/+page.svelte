<script>
	import { page } from '$app/stores';
	import { generatePaymentLink, stringifyCart } from '$lib/utils';
	import { onMount } from 'svelte';

	let cart;
	let paymentLink;

	page.subscribe((currentPage) => {
		cart = JSON.parse(decodeURIComponent(new URLSearchParams(currentPage.url.search).get('cart')));
	});

	onMount(() => {
		paymentLink = generatePaymentLink(cart);
	});
</script>

<h1>Thank You!!!!!</h1>
<h2>Here is your order:</h2>
{stringifyCart(cart)}

<hr />
<div>You can pay in person, or click the button below to open a special venmo link:</div>

<button><a href={paymentLink}>Pay Via Venmo</a></button>

<style>
	button {
		padding: 0.5rem;
		display: block;
		margin: 2rem 0;
		font-size: 1.2rem;
	}

	div {
		margin: 1rem 0;
	}
</style>
