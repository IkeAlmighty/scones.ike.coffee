<script>
	import { goto } from '$app/navigation';
	import ProductItem from '$lib/components/ProductItem.svelte';
	import IGIcon from '$lib/components/IGIcon.svelte';
	import TestimonialCarousel from '$lib/components/TestimonialCarousel.svelte';
	import { stringifyCart, calcSuggestedPayment, generatePaymentLink } from '$lib/utils.js';

	let products = {
		'choco-chip-blueberry-scone-2count': {
			name: '(2 Count) Chocolate Chip Blueberry Scone',
			imageUrl: '',
			amount: 0,
			details: 'Chocolate chips and blueberries in two delicious scones.',
			suggestedPrice: 7
		},
		'blueberry-lemon-scone-2count': {
			name: '(2 Count) Blueberry Lemon Scones',
			imageUrl: '',
			amount: 0,
			details: 'Lemon zest and blueberries in two delicious scones.',
			suggestedPrice: 7
		},
		'choco-chip-blueberry-scone-4count': {
			name: 'Chocolate Chip Blueberry Scones (4 Count)',
			imageUrl: '/scone_16count.jpg',
			details: 'Chocolate chips and bluberries in four delicious scones.',
			amount: 0,
			suggestedPrice: 12
		},
		'lemon-blueberry-scones-4count': {
			name: 'Blueberry Lemon Scones (4 Count)',
			imageUrl: '',
			details: 'Lemon zest and blueberries in four delicious scones.',
			amount: 0,
			suggestedPrice: 12
		},
		'delivery-fee': {
			name: 'Delivery Fee',
			amount: 0,
			suggestedPrice: 5
		}
	};

	const testimonials = [
		{
			author: 'Karen Ives',
			text: 'Scones were awesome, folks like they are "moist" and not dried out like so many scones, mostly gone by the time I left.'
		},
		{
			author: 'Slow Down',
			text: "Ike makes the best scones I've ever had. Wow are they yummy! Also love Ike's warm and fun spirit - tops off the experience!"
		},
		{
			author: 'Lisa',
			text: 'The scones were so good! They were fluffy and flavorful. I had a warm blueberry chocolate scone and the flavor combo was super good.'
		}
	];

	$: suggestedPayment = calcSuggestedPayment(products);

	let innerWidth = 0;
	$: device = innerWidth < 697 ? 'mobile' : 'desktop';

	let customerAddress;
	let delivering = false;
	let customerContact;
	let customerName;

	let additionalDetails;

	// update delivery fee if the delivery toggle is selected
	$: delivering ? (products['delivery-fee'].amount = 1) : (products['delivery-fee'].amount = 0);

	async function submitOrder() {
		// send order to backend to be emailed to me:
		let customerInfo = `${customerName}\ncustomer phone: ${customerContact}\n${delivering ? `Address: ${customerAddress}` : 'for pick up'}\nAddition Details:\n${additionalDetails}`;
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
	<div class="font-sm">Use the + and - signs to add to your order:</div>
	{#each Object.keys(products).filter((k) => k !== 'delivery-fee') as productKey}
		<div class="product-item-container">
			<ProductItem
				productName={products[productKey].name}
				imageUrl={products[productKey].imageUrl}
				price={products[productKey].suggestedPrice}
				details={products[productKey].details}
				bind:amount={products[productKey].amount}
			/>
			<hr class="mt-2" />
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
		<div>
			<div class="mt-2">Additional Details</div>
			<div class="font-sm">When do you want them? any special instructions?</div>
			<textarea bind:value={additionalDetails} />
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
	<div class="font-sm italic">Registered as a cottage producer under Ike's Kitchen</div>

	<div id="testimonial-contianer">
		<TestimonialCarousel {testimonials} />
	</div>

	<div id="social-media"><a href="https://www.instagram.com/scones.ike.coffee/"><IGIcon /></a></div>
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

	textarea {
		width: 90%;
		padding: 1rem;
	}

	#social-media {
		text-align: center;
		margin: 2rem auto;
	}

	#testimonial-contianer {
		margin: 5rem 0;
	}
</style>
