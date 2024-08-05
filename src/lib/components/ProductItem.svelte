<script>
	import { onMount } from 'svelte';

	export let price; // External price prop
	export let imageUrl;
	export let amount = 0; // bindable external amount prop
	export let details = '';
	export let productName;

	// Function to handle incrementing the amount
	function increment() {
		amount += 1;
	}

	// Function to handle decrementing the amount
	function decrement() {
		if (amount > 0) {
			amount -= 1;
		}
	}
</script>

<div class="product-item">
	<div id="product-name">{productName}</div>
	<img src={imageUrl} alt="" />
	<div class="product-info">
		<p>${price}</p>
		<div class="amount-controls">
			<button on:click={decrement}>-</button>
			<span>{amount}</span>
			<button on:click={increment}>+</button>
		</div>
	</div>
</div>

<style>
	.product-item {
		/* border: 1px solid black; */
		padding: 0.5rem;
		max-width: 400px;
	}

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
	.product-info {
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
