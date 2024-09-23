<script>
	export let date;

	const days = ['Monday', 'Tuesday', 'Friday', 'Saturday', 'Sunday'];

	let optionsHidden = true;
	let selectedOption;

	function handleOptionSelection(day) {
		selectedOption = day;
		optionsHidden = true;
	}
</script>

<button id="selection-box" on:click={() => (optionsHidden = !optionsHidden)}>
	Delivery Day: {selectedOption || ''}
	<span class="text-right">&#11206;</span>
</button>

{#if !optionsHidden}
	<div id="options-container">
		{#each days as day}
			<button class="option" on:click={() => handleOptionSelection(day)}>{day}</button>
		{/each}
	</div>
{/if}

<style>
	#options-container {
		position: absolute;
		background-color: white;
		width: calc(100% - 1.1rem);
		border: 1px solid black;
	}

	#selection-box {
		border: 1px solid black;
		padding: 0.25rem;
		border-radius: 5px;
		cursor: pointer;
		width: 100%;
		text-align: left;
		font-family: 'OldNewspaperTypes';
	}

	.option {
		display: block;
		background-color: inherit;
		width: 100%;
		border: none;
		text-align: left;
		padding: 0.5rem;
		margin: 0;
	}
</style>
