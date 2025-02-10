<script>
	export let data;
	$: scones = Object.keys(data.claims.scones).map((key) => data.claims.scones[key]);

	let claims = {};

	async function claimTwo() {
		const apiResponse = await fetch('/api/claim', {
			method: 'POST',
			body: { claims }
		});

		if (apiResponse.status === 200) {
			// TODO: update scones object to reflect backend
		}
	}
</script>

<div>
	{#each scones as scone}
		<div>
			<span>{scone.text}</span>
			<span>{scone.count}</span>
			<button on:click={() => claimTwo(scone.text)}>Claim 2</button>
		</div>
	{/each}
</div>
