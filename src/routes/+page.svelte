<script>
	import ProductItem from '$lib/components/ProductItem.svelte';

	let products = {
		'Lemon Earl Gray Scones (8)': {
			imageUrl: '/test-scones-delete-later.jpg',
			amount: 0,
			suggestedPrice: 19.5
		},
		'Chocolate Chip Blueberry Scones': {
			imageUrl: '',
			amount: 0,
			suggestedPrice: 19.5
		},
		'Cherry Chocolate Chip Scones': {
			imageUrl: '',
			amount: 0,
			suggestedPrice: 19.5
		},
		'Peanut Butter Cookies (8)': { amount: 0, suggestedPrice: 12 }
	};

	$: suggestedPayment = calcSuggestedPayment(products);

	let innerWidth = 0;
	$: device = innerWidth < 697 ? 'mobile' : 'desktop';

	$: paymentLink = `https://venmo.com/?txn=pay&audience=public&recipients=ike_kitchen&amount=${calcSuggestedPayment(products)}&note=${stringifyCart()}`;

	let customerAddress;
	let delivering = false;
	let customerContact;
	let customerName;

	function calcSuggestedPayment(p) {
		let total = 0;
		Object.keys(p).forEach((key) => {
			total += products[key].suggestedPrice * products[key].amount;
		});

		return total;
	}

	function stringifyCart() {
		let cartString = `${customerContact}\n${delivering ? customerAddress : 'for pick up'}`;
		Object.keys(products).forEach((productKey) => {
			let product = products[productKey];
			if (product.amount > 0) {
				cartString += `${productKey} x ${product.amount}, `;
			}
		});

		return cartString;
	}

	async function submitOrder() {
		window.open(paymentLink);

		//TODO: send order to backend to be texted to me:
		const apiResponse = await fetch('/', {
			method: 'POST',
			body: JSON.stringify({ message: stringifyCart() }),
			headers: { 'Content-Type': 'application/json' }
		});

		console.log(apiResponse);

		if (apiResponse.ok) {
			alert(
				'GOOD JOB! I have recieved your order. Make sure to pay may in the venmo tab that just opened :)))'
			);
		}
	}
</script>

<svelte:window bind:innerWidth />

<div id="page-container">
	<h1>Ike's Kitchen</h1>
	{#each Object.keys(products) as productName}
		<div class="product-item-container">
			<ProductItem
				{productName}
				imageUrl={products[productName].imageUrl}
				price={products[productName].suggestedPrice}
				bind:amount={products[productName].amount}
			/>
		</div>
	{/each}

	<div>
		<div>
			<label>
				<div>Delivery?</div>
				<input type="checkbox" bind:checked={delivering} />
			</label>
			<div class="inline-block font-sm danger-italic">I only deliver to Minneapolis</div>
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
			{#each Object.keys(products) as productName}
				{#if products[productName].amount > 0}
					<div>{productName} x {products[productName].amount}</div>
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
</div>

<style>
	label div {
		display: inline-block;
		width: 9rem;
	}
	#page-container {
		max-width: 500px;
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
