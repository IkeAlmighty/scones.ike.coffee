<script>
	import { goto } from '$app/navigation';

	let phone = '';
	let password = '';
	let username = '';
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
			body: JSON.stringify({ phone, password, username })
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

<form on:submit|preventDefault={handleSignup}>
	<div>
		<label>
			<div>Phone:</div>
			<input type="tel" bind:value={phone} required />
		</label>
	</div>

	<div>
		<label>
			<div>Password:</div>
			<input type="password" bind:value={password} required />
		</label>
	</div>

	<div>
		<label>
			<div>Your Name:</div>
			<input type="string" bind:value={username} required />
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

<style>
	form {
		max-width: 400px;
		margin: 100px auto;
	}

	label div {
		width: 100px;
		display: inline-block;
	}

	form input {
		padding: 0.25rem;
		margin: 5px;
		font-size: 1rem;
	}

	form button {
		padding: 0.25rem 0.5rem;
		font-size: 1rem;
		margin: 2rem 0;
	}

	p {
		color: red;
	}
</style>
