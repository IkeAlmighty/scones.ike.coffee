<script>
	import { page } from '$app/stores';
	import BulletinBoard from '$lib/components/BulletinBoard.svelte';
	import { generatePaymentLink, stringifyCart } from '$lib/utils';

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

<div>I will reach out via text in the next 24 hours to confirm delivery/pickup time!</div>

<div><a href="/">&lt;-- back to order page</a></div>

<hr />

<BulletinBoard />

<style>
	div {
		margin: 1rem 0;
	}
</style>
