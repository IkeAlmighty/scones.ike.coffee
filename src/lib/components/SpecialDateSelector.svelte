<!-- date selector for only the dates passed to it -->

<script>
	const today = new Date();
	export let openDates = [];
	export let dateSelected;
</script>

<div class="text-center my-2">
	<h3>Choose a date for pickup/delivery:</h3>
	{#each openDates as date}
		{#if date.getTime() >= today.getTime()}
			<button
				class:chosen={dateSelected && dateSelected.getTime() === date.getTime()}
				on:click={() => (dateSelected = date)}
			>
				{date.toDateString()}
			</button>
		{/if}
	{/each}
</div>

<style>
	button {
		margin: 0.25rem;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		background-color: #f9f9f9;
		cursor: pointer;
	}

	button.chosen {
		background-color: rgb(146, 146, 211);
		color: white;
		border-color: black;
	}
</style>
