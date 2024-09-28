<script>
	import { goto } from '$app/navigation';
	import ProductItem from '$lib/components/ProductItem.svelte';
	import IGIcon from '$lib/components/IGIcon.svelte';
	import TestimonialCarousel from '$lib/components/TestimonialCarousel.svelte';
	import { stringifyCart, calcSuggestedPayment, generatePaymentLink } from '$lib/utils.js';
	import StripePaymentElement from '$lib/components/StripePaymentElement.svelte';

	// a copy of products is used as a cart object, before being compared at checkout
	// on the backend to the prices listed in the structure:
	import { products } from '$lib/products.js';

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
		},
		{
			author: 'Julia',
			text: "fuck I'm gonna eat all 4 today :'D :'D ... Oh shit they're delicious"
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

	let payInPerson = false;

	// update delivery fee if the delivery toggle is selected
	$: delivering ? (products['delivery-fee'].amount = 1) : (products['delivery-fee'].amount = 0);

	async function submitOrder(e) {
		e.target.disabled = true;
		e.target.innerText = 'one moment...';
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
		e.target.disabled = false;
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
				shorthandName="scone"
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
				{#each Object.keys(products) as key}
					{#if products[key].amount > 0}
						<div>{products[key].name} x {products[key].amount}</div>
					{/if}
				{/each}
			</div>
		</div>
		<hr />
		<div>Payment Total: ${suggestedPayment}</div>
	</div>

	{#if suggestedPayment === 0 || (delivering && suggestedPayment === products['delivery-fee'].suggestedPrice)}
		<div class="font-sm danger-italic text-center my-2">
			Uh oh!!! Your cart is empty. Don't you want scones?
		</div>
	{:else if (delivering && !customerAddress) || !customerContact || !customerName}
		<div class="font-sm danger-italic text-center my-2">
			I can't take your order yet! Fill out your contact information {delivering
				? 'and delivery address'
				: ''}.
		</div>
		<button disabled={true}>Submit Order</button>
	{:else if !payInPerson}
		<div class="mt-2">Enter Payment Details:</div>
		<StripePaymentElement cart={products} sideEffect={submitOrder} />
	{:else}
		<div class="mt-2">
			<button id="paymentButton" on:click={submitOrder}>Submit Scone Order</button>
		</div>
	{/if}

	<div class="font-sm mt-2">These foods are homemade and not subject to state inspection.</div>
	<div class="font-sm italic">Registered as a cottage producer under Ike's Kitchen</div>

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
		margin: 3rem auto;
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
