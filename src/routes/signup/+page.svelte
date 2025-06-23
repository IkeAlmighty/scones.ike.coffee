<script>
	import { goto } from '$app/navigation';

	let phone = '';
	let password = '';
	let username = '';
	let notificationConsent = true;

	let error = '';
	let loading = false;

	async function handleSignup() {
		error = '';
		loading = true;

		const res = await fetch('/api/users/create', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ phone, password, username, notificationConsent })
		});

		loading = false;

		if (res.ok) {
			goto('/');
		} else {
			const data = await res.json();
			error = data.error || 'Signup failed';
		}
	}
</script>

<div id="container">
	<h1>Create a <img src="favicon.png" alt="scone" /> account</h1>

	<form on:submit|preventDefault={handleSignup}>
		<div>
			<label>
				<div class="label-text">Phone:</div>
				<input type="tel" bind:value={phone} required />
			</label>
		</div>

		<div>
			<label>
				<div class="label-text">Password:</div>
				<input type="password" bind:value={password} required />
			</label>
		</div>

		<div>
			<label>
				<div class="label-text">Your Name:</div>
				<input type="string" bind:value={username} required />
			</label>
		</div>

		<div style="margin-top: 1rem;">
			<label>
				<input type="checkbox" value={notificationConsent} checked={notificationConsent} />
				<span>I want to recieve text messages about scones</span>
				<div class="info">
					By checking the box above you agree to recieve text marketing messages from
					scones.ike.coffee, including location and time of pop up sales, discounts, and sometimes
					pretty scone pictures 😊
				</div>
			</label>
		</div>

		<div>
			<button type="submit" disabled={loading}>
				{loading ? 'Creating Account...' : 'Sign Up'}
			</button>
		</div>

		{#if error}
			<p>{error}</p>
		{/if}
	</form>
</div>

<style>
	img {
		width: 50px;
		height: 50px;
		vertical-align: middle;
	}

	#container {
		max-width: 400px;
		margin: 75px auto;
	}

	.label-text {
		width: 100px;
		display: inline-block;
	}

	form input:not([type='checkbox']) {
		padding: 0.25rem;
		margin: 5px 0;
		font-size: 1rem;
		width: 250px;
	}

	form button {
		padding: 0.25rem 0.5rem;
		font-size: 1rem;
		margin: 2rem 0;
	}

	p {
		color: red;
	}

	h1 {
		text-align: center;
	}

	.info {
		margin: 0.5rem 0;
		font-size: 0.7rem;
		font-family: Verdana, Geneva, Tahoma, sans-serif;
	}
</style>
