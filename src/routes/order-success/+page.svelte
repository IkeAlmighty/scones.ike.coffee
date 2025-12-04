<script>
	import { page } from '$app/stores';
	import { generatePaymentLink, stringifyCart } from '$lib/utils';
	import { onMount } from 'svelte';

	let cart;

	page.subscribe((currentPage) => {
		cart = JSON.parse(
			decodeURIComponent(new URLSearchParams(currentPage.url.search).get('cart') || '{}')
		);
	});
</script>

<h1>Thank You!!!!!</h1>
<h2>Here is your order:</h2>
{#each stringifyCart(cart).split('\n') as item}
	{item}<br />
{/each}

<hr />
<div>You should recieve and automated text confirming your order!</div>

<div><a href="/">&lt;-- back to order page</a></div>

<style>
	div {
		margin: 1rem 0;
	}
</style>
