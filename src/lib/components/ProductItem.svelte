<script>
	import { onMount } from 'svelte';

	export let price; // External price prop
	export let imageUrl;
	export let amount = 0; // bindable external amount prop
	export let productName;
	export let details;
	export let shorthandName = productName;
	export let additionalLink;
	export let additionalLinkText;
	export let batchCounts;

	let batchCountIndex = 0;

	// Function to handle incrementing the amount
	function increment() {
		if (batchCountIndex === batchCounts.length - 1) return;
		batchCountIndex += 1;
		amount = batchCounts[batchCountIndex];
	}

	// Function to handle decrementing the amount
	function decrement() {
		if (batchCountIndex === 0) return;
		batchCountIndex -= 1;
		amount = batchCounts[batchCountIndex];
	}
</script>

<div class="product-item">
	<div id="product-name">
		{productName}
		{#if additionalLink}
			| <a href={additionalLink}>{additionalLinkText}</a>{/if}
	</div>
	<img src={imageUrl} alt="" />
	<div class="product-info">
		<p>${price} per {shorthandName}</p>
		{#if details}
			<div class="font-sm italic my-2">{details}</div>
		{/if}
		<div class="amount-controls">
			<button on:click={decrement}>-</button>
			<span>{amount}</span>
			<button on:click={increment}>+</button>
		</div>
	</div>
</div>

<style>
	#product-name {
		font-size: 1.2rem;
	}

	.product-item img {
		width: 100%;
		max-height: 300px;
		overflow: clip;
		object-fit: cover;
		border-radius: 5px;
	}

	.amount-controls {
		font-size: 1.5rem;
		text-align: center;
	}
	.amount-controls button {
		font-size: inherit;
		border: none;
		background-color: inherit;
		cursor: pointer;
	}
</style>
