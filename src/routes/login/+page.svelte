<script>
	import { goto } from '$app/navigation';

	let phone = '';
	let password = '';
	let error = '';

	async function handleLogin() {
		error = '';

		const res = await fetch('/api/users/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ phone, password })
		});

		if (res.ok) {
			// ✅ Login succeeded — redirect or update UI
			goto('/'); // or wherever you want to go after login
		} else {
			// ❌ Login failed — show error
			const data = await res.json();
			error = data.error || 'Login failed';
		}
	}
</script>

<form on:submit|preventDefault={handleLogin}>
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

	<button type="submit"> Log In </button>

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
