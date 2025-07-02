<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let user = null;
	let loading = true;

	onMount(async () => {
		try {
			const res = await fetch('/api/users/me');
			if (res.ok) {
				user = await res.json();
			} else {
				user = null;
			}

			loading = false;
		} catch (e) {
			error = 'Failed to fetch user info';
			console.error(e);
		}
	});

	async function handleLogout() {
		const res = await fetch('/api/users/logout', { method: 'POST' });
		if (res.ok) {
			user = null;
			goto('/');
		} else {
			console.error('Logout failed');
		}
	}
</script>

<div>
	{#if loading}
		...logging in
	{:else if user}
		<a href="/account">Account</a>
		<button on:click={handleLogout}> Logout </button>
	{:else}
		<a href="/login">Login/Sign Up</a>
	{/if}
</div>

<style>
	div {
		text-align: right;
	}

	button,
	a {
		color: black;
		border: none;
		background-color: none;
		border-radius: 2px;
		padding: 5px 10px;
		cursor: pointer;
	}

	a:visited {
		color: black;
	}
</style>
