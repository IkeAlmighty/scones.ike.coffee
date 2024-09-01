<script>
	import { goto } from '$app/navigation';
	import ProductItem from '$lib/components/ProductItem.svelte';
	import { stringifyCart, calcSuggestedPayment, generatePaymentLink } from '$lib/utils.js';

	let products = {
		'choco-chip-blueberry-scone-8count': {
			name: 'Chocolate Chip Blueberry Scones (8 count)',
			imageUrl: '',
			amount: 0,
			suggestedPrice: 19.5
		},
		'choco-chip-blueberry-scone-single': {
			name: 'Chocolate Chip Blueberry Scone (single)',
			imageUrl: '/blueberry_scone.jpg',
			amount: 0,
			suggestedPrice: 3
		},
		'delivery-fee': {
			name: 'Delivery Fee',
			amount: 0,
			suggestedPrice: 5
		}
	};

	$: suggestedPayment = calcSuggestedPayment(products);

	let innerWidth = 0;
	$: device = innerWidth < 697 ? 'mobile' : 'desktop';

	let customerAddress;
	let delivering = false;
	let customerContact;
	let customerName;

	// update delivery fee if the delivery toggle is selected
	$: delivering ? (products['delivery-fee'].amount = 1) : (products['delivery-fee'].amount = 0);

	async function submitOrder() {
		// send order to backend to be emailed to me:
		let customerInfo = `${customerName}\ncustomer phone: ${customerContact}\n${delivering ? `Address: ${customerAddress}` : 'for pick up'}\n`;
		const apiResponse = await fetch('/', {
			method: 'POST',
			body: JSON.stringify({ message: `${customerInfo}\n\n${stringifyCart(products)}` }),
			headers: { 'Content-Type': 'application/json' }
		});

		if (apiResponse.ok) {
			goto(`/order-success?cart=${encodeURIComponent(JSON.stringify(products))}`);
		} else {
			console.log(await apiResponse.text());
		}
	}
</script>

<svelte:window bind:innerWidth />

<div id="page-container">
	<h1>scones.ike.coffee</h1>
	<div>Selling real scones for ike's imaginary coffee shop.</div>
	{#each Object.keys(products).filter((k) => k !== 'delivery-fee') as productKey}
		<div class="product-item-container">
			<ProductItem
				productName={products[productKey].name}
				imageUrl={products[productKey].imageUrl}
				price={products[productKey].suggestedPrice}
				bind:amount={products[productKey].amount}
			/>
		</div>
	{/each}

	<div>
		<div>
			<label>
				<div>Delivery?</div>
				<input type="checkbox" bind:checked={delivering} />
			</label>
			<div class="font-sm danger-italic">
				Please note that I only deliver to Minneapolis, via bicycle. Sorry!
			</div>
		</div>

		{#if delivering}
			<div>
				<label
					><div>Delivery Address:</div>
					<input type="text" bind:value={customerAddress} /></label
				>
			</div>
		{/if}
		<div>
			<label
				><div>Phone #:</div>
				<input type="text" bind:value={customerContact} /></label
			>
		</div>
		<div>
			<label
				><div>Your Name:</div>
				<input type="text" bind:value={customerName} /></label
			>
		</div>
	</div>

	<div id={`payment-total-container-${device}`}>
		<div>
			<hr />
			{#each Object.keys(products) as key}
				{#if products[key].amount > 0}
					<div>{products[key].name} x {products[key].amount}</div>
				{/if}
			{/each}
		</div>

		<div>Suggested Payment: ${suggestedPayment}</div>

		{#if !(customerContact && (customerAddress || !delivering))}
			<div class="mt-2 font-sm danger-italic">
				I need your contact information before you click 'Submit Order'
			</div>
		{/if}

		<button
			id="submitOrderButton"
			disabled={!(customerContact && (customerAddress || !delivering))}
			on:click={submitOrder}>Submit Order</button
		>
	</div>

	<div class="font-sm mt-2">These foods are homemade and not subject to state inspection.</div>
</div>

<style>
	label div {
		display: inline-block;
		width: 10rem;
	}
	#page-container {
		max-width: 600px;
		margin: auto auto;
	}

	#payment-total-container-desktop {
		font-size: 1rem;
		margin-top: 3rem;
	}

	#payment-total-container-mobile {
		font-size: 1rem;
		margin-top: 3rem;
	}

	#submitOrderButton {
		padding: 1rem;
		font-size: 1.2rem;
		margin: 1rem auto;
	}

	.product-item-container {
		margin: 3rem auto;
	}
</style>
