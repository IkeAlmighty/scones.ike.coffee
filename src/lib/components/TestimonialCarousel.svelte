<script>
	import { onMount } from 'svelte';

	export let testimonials = [];
	let current = 0;

	function incrTestimonial() {
		if (current + 1 == testimonials.length) {
			current = 0;
		} else {
			current += 1;
		}
	}

	function decrTestimonial() {
		if (current - 1 < 0) {
			current = testimonials.length - 1;
		} else {
			current -= 1;
		}
	}

	onMount(() => {
		current = Math.floor(Math.random() * testimonials.length);
	});
</script>

<h3>Testimonials</h3>
<div id="container">
	{#if testimonials.length > 1}
		<div id="left">
			<button on:click={incrTestimonial}>&larr; previous</button>
		</div>
	{/if}

	<div id="text-container">
		{#if testimonials[current]}
			<div id="center">"{testimonials[current].text}"<br /> - {testimonials[current].author}</div>
		{/if}
	</div>

	{#if testimonials.length > 1}
		<div id="right">
			<button on:click={decrTestimonial}>next &rarr;</button>
		</div>
	{/if}
</div>

<style>
	#left {
		text-align: left;
		font-size: small;
	}

	#right {
		text-align: right;
		font-size: small;
	}

	#text-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		min-height: 150px;
	}

	#center {
		margin: 1rem 0;
	}

	button {
		border: none;
		background-color: inherit;
		text-decoration: underline;
	}
</style>
