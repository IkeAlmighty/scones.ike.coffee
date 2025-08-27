<script>
	import Calendar from '$lib/components/Calendar.svelte';
	import IgIcon from '$lib/components/IGIcon.svelte';
	import IGIcon from '$lib/components/IGIcon.svelte';
	import TestimonialCarousel from '$lib/components/TestimonialCarousel.svelte';
	import UserNavBar from '$lib/components/UserNavBar.svelte';

	import { products } from '$lib/pickupProducts.js';
	import testimonials from '$lib/testimonials.js';
	import { onMount } from 'svelte';

	let cart = { ...products };

	let innerWidth = 0;
	$: device = innerWidth < 697 ? 'mobile' : 'desktop';

	let message;

	async function sendMessage(e) {
		e.target.disabled = true;
		const apiResponse = await fetch('/', {
			method: 'POST',
			body: JSON.stringify({ message }),
			headers: { 'Content-Type': 'application/json' }
		});

		if (apiResponse.ok) {
			console.log('yay');
		}

		e.target.disabled = false;
	}
</script>

<svelte:window bind:innerWidth />

<UserNavBar />

<div id="page-container">
	<div id="header">
		<img
			id="logo-img"
			src="/sconelogo.jpg"
			alt="logo depicting a bike with scones the front basket"
		/>
		<div>Baking scones for S. Minneapolis.</div>
	</div>
	<hr />

	<div class="font-sm danger-italic text-center my-2">
		Bike delivery has been paused due to a lack of spoons.
		<br />
		<br />
		You can sign up for sconifications <a href="/signup">here</a>.
	</div>

	<br />
	<div>
		<div>
			<div>Need to leave me a message?? Go for it:</div>
			<div class="font-sm">( testimonials welcome )</div>
			<textarea bind:value={message} />
			<button on:click={sendMessage}>Send</button>
		</div>
	</div>

	<div class="mt-5"></div>

	<div id="product-container">
		{#each Object.keys(products) as productKey}
			<div>
				<img src={products[productKey].imageUrl} alt={products[productKey].details} />
			</div>
		{/each}
	</div>

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
	#page-container {
		max-width: calc(531px + 0.5rem);
		margin: auto auto;
	}

	#logo-img {
		display: inline-block;
		width: 200px;
	}

	#header {
		text-align: center;
	}

	#product-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		column-gap: 0.25rem;
	}

	#product-container img {
		width: 177px;
		height: 177px;
		object-fit: cover;
		display: inline-block;
	}

	textarea {
		width: calc(100% - 2rem);
		padding: 1rem;
		font-size: 1.25rem;
	}

	button {
		padding: 0.5rem;
		font-size: 1rem;
		border-radius: 5px;
		width: 100px;
		margin: 1rem auto;
	}

	#social-media {
		text-align: center;
		margin: 2rem auto;
	}

	#testimonial-container {
		margin: 5rem 0;
	}

	#ig-embedded-link {
		display: inline-block;
		vertical-align: middle;
		margin: 0 0.5rem;
	}
</style>
