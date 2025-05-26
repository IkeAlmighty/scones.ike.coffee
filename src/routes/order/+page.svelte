<script>
	import { goto } from '$app/navigation';
	import ProductItem from '$lib/components/ProductItem.svelte';
	import IGIcon from '$lib/components/IGIcon.svelte';
	import TestimonialCarousel from '$lib/components/TestimonialCarousel.svelte';
	import {
		stringifyCart,
		calcSuggestedPayment,
		generatePaymentLink,
		prettifyDate
	} from '$lib/utils.js';
	import StripePaymentElement from '$lib/components/StripePaymentElement.svelte';

	// a copy of products is used as a cart object, before being compared at checkout
	// on the backend to the prices listed in the structure:
	import { products } from '$lib/products.js';
	import DateSelector from '$lib/components/DateSelector.svelte';
	import testimonials from '$lib/testimonials.js';

	let cart = { ...products };
	$: suggestedPayment = calcSuggestedPayment(cart);

	let innerWidth = 0;
	$: device = innerWidth < 697 ? 'mobile' : 'desktop';

	let customerAddress;
	let delivering = false;
	let customerContact;
	let customerName;
	let deliveryDate;

	let additionalDetails;

	let payInPerson = false;

	// update delivery fee if the delivery toggle is selected
	$: delivering ? (cart['delivery-fee'].amount = 1) : (cart['delivery-fee'].amount = 0);

	async function submitOrder(e) {
		e.target.disabled = true;
		e.target.innerText = 'one moment...';
		// send order to backend to be emailed to me:
		let customerInfo = `${customerName}\ncustomer phone: ${customerContact}\n${delivering ? `Address: ${customerAddress}` : 'for pick up'}\nPickup/Delivery Date: ${deliveryDate}\nPaid: ${payInPerson ? 'Paying in person.' : 'yes'}\n\nAddition Details:\n${additionalDetails}`;
		const apiResponse = await fetch('/', {
			method: 'POST',
			body: JSON.stringify({ message: `${customerInfo}\n\n${stringifyCart(cart)}` }),
			headers: { 'Content-Type': 'application/json' }
		});

		if (apiResponse.ok) {
			goto(`/order-success?cart=${encodeURIComponent(JSON.stringify(cart))}`);
		} else {
			console.log(await apiResponse.text());
		}
		e.target.disabled = false;
	}
</script>

<svelte:window bind:innerWidth />

<div id="page-container">
	<div id="header">
		<!-- <h1>scones.ike.coffee</h1> -->
		<img
			id="logo-img"
			src="/sconelogo.jpg"
			alt="logo depicting a bike with scones the front basket"
		/>
		<div>Baking & delivering scones to S. Minneapolis via bicycle.</div>
	</div>
	<hr />

	{#each Object.keys(products).filter((k) => k !== 'delivery-fee') as productKey}
		<div class="product-item-container">
			<ProductItem
				productName={products[productKey].name}
				shorthandName={products[productKey].singular}
				imageUrl={products[productKey].imageUrl}
				price={products[productKey].suggestedPrice}
				details={products[productKey].details}
				bind:amount={cart[productKey].amount}
				additionalLink={products[productKey].additionalLink}
				additionalLinkText={products[productKey].additionalLinkText}
				batchCounts={products[productKey].batchCounts}
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

		<div class="my-1">
			<DateSelector bind:dateSelected={deliveryDate} />
		</div>

		<div>
			<div class="font-sm">Any special instructions? (optional)</div>
			<textarea bind:value={additionalDetails} />
		</div>
	</div>

	<h3>Order Summary</h3>

	<div>
		<label>
			Paying in Person
			<input type="checkbox" bind:checked={payInPerson} />
		</label>
	</div>

	<div id={`payment-total-container-${device}`}>
		<div>
			<div class="inline-block">
				{#each Object.keys(cart) as key}
					{#if cart[key].amount > 0}
						<div>{cart[key].name} x {cart[key].amount}</div>
					{/if}
				{/each}
			</div>
		</div>
		<hr />
		<div>Suggested Payment: ${suggestedPayment}</div>
		<div class="text-sm italic">
			To be {delivering ? 'delivered' : 'picked up'} on {prettifyDate(deliveryDate)}
		</div>
	</div>

	{#if suggestedPayment === 0 || (delivering && suggestedPayment === products['delivery-fee'].suggestedPrice)}
		<div class="font-sm danger-italic text-center my-2">
			Uh oh!!! Your cart is empty. Don't you want scones?
		</div>
	{:else if delivering && !customerAddress}
		<div class="font-sm danger-italic text-center my-2">Please fill out your delivery address.</div>
	{:else if !customerContact || !customerName}
		<div class="font-sm danger-italic text-center my-2">
			Please fill out your contact information.
		</div>
	{:else if !deliveryDate}
		<div class="font-sm danger-italic text-center my-2">
			Please choose a day for pickup/delivery.
		</div>
	{:else if !payInPerson}
		<div class="mt-2">Enter Payment Details:</div>
		<StripePaymentElement {cart} sideEffect={submitOrder} />
	{:else}
		<div class="mt-2">
			<button id="paymentButton" on:click={submitOrder}>Submit Scone Order</button>
		</div>
	{/if}

	<div class="font-sm mt-2">These foods are homemade and not subject to state inspection.</div>

	<div id="testimonial-container">
		<TestimonialCarousel {testimonials} />
	</div>

	<div class="italic mt-2 text-center">
		"Oh, gather round my friends,<br />
		let me tell you a tale, <br />
		Of a scone so divine, <br />
		it'll never grow stale.<br />
		<br />
		With zest of a lemon, <br />
		oh so bright, <br />
		and blueberries bursting, <br />
		a heavenly sight.<br />
		<br />
		Golden and warm, <br />
		from the oven it came,<br />
		A treat so delicious, <br />
		it put others to shame.<br />
		<br />
		So raise it up high, <br />
		in the morning light, <br />
		For the lemon blueberry scone is a true delight!<br />
		Thank you for the tasty treat, ike!"<br />
		<br />
	</div>
	<div class="my-2 text-center">- written by Mud, a valued customer.</div>

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

	#logo-img {
		display: inline-block;
		width: 200px;
	}

	#header {
		text-align: center;
	}

	#payment-total-container-desktop,
	#payment-total-container-mobile {
		font-size: 1rem;
		position: sticky;
		bottom: 0;
		background-color: white;
		border: solid 2px black;
		padding: 1rem;
		margin-top: 1rem;
		border-radius: 5px;
	}

	.product-item-container {
		margin: 2rem auto 4rem auto;
	}

	textarea {
		width: calc(100% - 2rem);
		padding: 1rem;
	}

	#paymentButton {
		padding: 0.5rem;
		font-size: 1.5rem;
		border-radius: 5px;
	}

	#social-media {
		text-align: center;
		margin: 2rem auto;
	}

	#testimonial-container {
		margin: 5rem 0;
	}
</style>
