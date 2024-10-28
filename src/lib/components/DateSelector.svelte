<script>
	import { prettifyDate } from '$lib/utils';

	export let dateSelected;

	let days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
	const today = new Date();
	let weekOfDate = new Date(new Date().setDate(today.getDate() - today.getDay()));
	if (today.getDay() === 5) incrWeekOfDate();

	let optionsHidden = true;
	let selectedOption;

	function handleOptionSelection(day) {
		selectedOption = day;
		optionsHidden = true;
	}

	function incrWeekOfDate() {
		weekOfDate = createDateFromOffset(weekOfDate, 7);
	}

	function decrWeekOfDate() {
		weekOfDate = createDateFromOffset(weekOfDate, -7);
	}

	function createDateFromOffset(date, offset) {
		return new Date(new Date(date).setDate(date.getDate() + offset));
	}
</script>

<div>Choose a date for pickup/delivery:</div>

<div id="date-container">
	<div>
		<div>
			week of {prettifyDate(weekOfDate)}

			<button class="next-prev-btn" on:click={incrWeekOfDate}>next week</button>
			{#if createDateFromOffset(weekOfDate, -1).getTime() > today.getTime()}
				<button class="next-prev-btn" on:click={decrWeekOfDate}>prev week</button>
			{/if}
		</div>
	</div>
	<div class="my-1">
		{#each days.map( (string, index) => ({ string, index, date: createDateFromOffset(weekOfDate, index) }) ) as day}
			<span>
				<button
					class={`date-btn ${dateSelected ? (dateSelected.getTime() === day.date.getTime() ? 'selected-btn' : '') : ''}`}
					disabled={day.date.getTime() < today.getTime() + 86400000}
					on:click={() => (dateSelected = day.date)}
				>
					{day.string}
				</button>
				<div class="font-sm text-center">
					{prettifyDate(day.date)}
				</div>
			</span>
		{/each}
	</div>

	<div class="text-right my-2"></div>
</div>

<style>
	#date-container {
		padding: 1rem 0;
	}

	#date-container span {
		display: inline-block;
		margin-right: 1rem;
	}

	button {
		background-color: inherit;
		padding: 0.25rem 0.5rem;
		margin: 0.25rem 0;
	}

	button:disabled {
		background-color: black;
		cursor: default;
	}

	.date-btn {
		width: 4.5rem;
		margin: 0 0;
		margin-top: 0.75rem;
	}

	.selected-btn {
		background-color: lightgray;
		font-size: 1.2rem;
	}

	.next-prev-btn {
		border: none;
		text-decoration: underline;
		float: right;
	}
</style>
