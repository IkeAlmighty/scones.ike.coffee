<script>
	import { goto } from '$app/navigation';

	export let data;

	let phone = '';
	let username = '';
	let notificationConsent = true;
	let referral = data.referral;

	let password = referral ? undefined : '';
	let passwordRepeat = referral ? undefined : '';

	let error = '';
	let loading = false;

	async function handleSignup() {
		error = '';
		loading = true;

		// abort if passwords don't match
		if (password && (password.trim() !== passwordRepeat.trim() || password.trim() === '')) {
			error = 'Passwords do not match';
			loading = false;
			return;
		}

		const res = await fetch('/api/users/create', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				phone,
				username,
				password,
				notificationConsent,
				referralId: referral?.id || undefined
			})
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
	{#if referral}
		<h1>Subscribe to <img src="favicon.png" alt="scone" />SCONIFICATIONS</h1>

		<div id="referral-message">
			Referred by {referral.username}
		</div>
	{:else}
		<h1>Create a <img src="favicon.png" alt="scone" /> Scone Account :)</h1>
	{/if}

	<form on:submit|preventDefault={handleSignup}>
		<div>
			<label>
				<div class="label-text">Phone:</div>
				<input type="tel" bind:value={phone} required />
			</label>
		</div>

		<div>
			<label>
				<div class="label-text">Your Name:</div>
				<input type="string" bind:value={username} required />
			</label>
		</div>

		{#if !referral}
			<div>
				<label>
					<div class="label-text">Password:</div>
					<input type="password" bind:value={password} required />
				</label>
			</div>

			<div>
				<label>
					<div class="label-text info">Repeat Password:</div>
					<input type="password" bind:value={passwordRepeat} required />
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
		{/if}

		<div class="text-center">
			<button type="submit" disabled={loading}>
				{loading ? 'Creating Account...' : '🍪 Sign Up'}
			</button>
		</div>

		{#if referral}
			<div class="info">
				By pressing 'Sign Up' you agree to recieve text marketing messages from scones.ike.coffee,
				including location and time of pop up sales, discounts, and sometimes pretty scone pictures
				😊
			</div>
		{/if}

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

	#referral-message {
		margin: 2rem 0;
		text-align: center;
		color: pink;
		background-color: black;
		padding: 1rem 2rem;
		border-radius: 1rem;
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
		padding: 0.5rem 1rem;
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

	button {
		background: linear-gradient(135deg, #ffb347, #ffcc33);
		color: #4b2e00;
		font-weight: bold;
		border: none;
		padding: 12px 24px;
		font-size: 1.1rem;
		border-radius: 12px;
		box-shadow: 0 4px 0 #c69318;
		transition: all 0.2s ease;
		cursor: pointer;
	}

	button:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
	}

	button:active {
		transform: translateY(1px);
		box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
	}
</style>
