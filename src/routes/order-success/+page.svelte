<script>
	import { page } from '$app/stores';
	import BulletinBoard from '$lib/components/BulletinBoard.svelte';
	import { generatePaymentLink, stringifyCart } from '$lib/utils';
	import { onMount } from 'svelte';

	let cart;

	page.subscribe((currentPage) => {
		cart = JSON.parse(
			decodeURIComponent(new URLSearchParams(currentPage.url.search).get('cart') || '{}')
		);
	});

	async function getImageSources() {
		const listFilesResponse = await fetch('/api/bulletinboard/list-all');
		const { files, downloadUrl } = await listFilesResponse.json();
		console.log(files);
		const imageSrcs = files.map((file) => `${downloadUrl}/file/scones-ike-coffee/${file.fileName}`);

		return imageSrcs;
	}
</script>

<h1>Thank You!!!!!</h1>
<h2>Here is your order:</h2>
{#each stringifyCart(cart).split('\n') as item}
	{item}<br />
{/each}

<div>I will reach out via text in the next 24 hours to confirm delivery/pickup time!</div>

<div><a href="/">&lt;-- back to order page</a></div>

<hr />

<BulletinBoard {getImageSources} />

<style>
	div {
		margin: 1rem 0;
	}
</style>
