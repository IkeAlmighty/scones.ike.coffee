<script>
	import { prettifyDate } from '$lib/utils';
	import closedDates from '../closed-dates.js';

	export let dateSelected;
	export let isSubscription;

	$: (isSubscription || !isSubscription) && (dateSelected = undefined);

	let days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
	const today = new Date();
	let weekOfDate = new Date(new Date().setDate(today.getDate() - today.getDay()));
	if (today.getDay() == 6) incrWeekOfDate();

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

	function dateIsValid(day) {
		const isLessThanOneDay = day.date.getTime() < today.getTime() + 86400000;
		// const isWed = day.date.getDay() === 3;
		let isClosed = false;
		closedDates.forEach((dateString) => {
			const [y, d, m] = dateString.split('-');
			const closedDate = new Date(y, m - 1, d);
			if (closedDate.getUTCDate() === day.date.getUTCDate()) {
				isClosed = true;
			}
		});

		return !isLessThanOneDay && !isClosed;
	}

	function getButtonSelectedClass(day) {
		if (!dateSelected) return ''; // return no class

		if (isSubscription && day.date.getDay() === dateSelected.getDay()) {
			return 'selected-btn';
		}

		if (dateSelected.getTime() === day.date.getTime()) {
			return 'selected-btn';
		}
	}

	function selectDate(day) {
		if (!dateIsValid(day) && isSubscription) {
			dateSelected = createDateFromOffset(day.date, 7);
			console.log(dateSelected);
		} else {
			dateSelected = day.date;
		}
	}
</script>

<div id="date-container">
	<div class="my-1 font-lg text-center">
		<button
			class={`special-btn one-time-btn ${!isSubscription && 'selected-btn'}`}
			on:click={() => (isSubscription = false)}
		>
			One Time Order
		</button>
		or
		<button
			class={`special-btn subscription-btn ${isSubscription && 'selected-btn animated'}`}
			on:click={() => (isSubscription = true)}
		>
			Weekly Subscription
		</button>
	</div>
	<div>
		Choose a {#if isSubscription}(recuring)
		{/if} day for pickup/delivery:
	</div>
	{#if !isSubscription}
		<div>
			<div>
				week of {prettifyDate(weekOfDate)}
				<button class="next-prev-btn" on:click={incrWeekOfDate}>next week</button>
				{#if createDateFromOffset(weekOfDate, -1).getTime() > today.getTime()}
					<button class="next-prev-btn" on:click={decrWeekOfDate}>prev week</button>
				{/if}
			</div>
		</div>
	{/if}
	<div class="my-1">
		{#each days.map( (string, index) => ({ string, index, date: createDateFromOffset(weekOfDate, index) }) ) as day}
			<span>
				<button
					class={`date-btn ${dateSelected && getButtonSelectedClass(day)}`}
					disabled={!isSubscription && !dateIsValid(day)}
					on:click={() => selectDate(day)}
				>
					{day.string}
				</button>
				{#if !isSubscription}
					<div class="font-sm text-center">
						{prettifyDate(day.date)}
					</div>
				{/if}
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
		width: 4.3rem;
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

	.special-btn {
		border: none;
		background-color: inherit;
		padding: 1rem;
		font-size: 0.9rem;
		cursor: pointer;
		border-radius: 1rem;
		margin: 2px;
	}

	.one-time-btn {
		background-color: aliceblue;
	}

	.subscription-btn {
		background-color: aliceblue;
	}

	.animated {
		animation: pulse 3s infinite ease-in-out;
	}

	.selected-btn {
		border: 2px black solid;
		margin: 0;
	}

	@keyframes pulse {
		0%,
		100% {
			background-color: antiquewhite;
		}
		50% {
			background-color: rgb(255, 220, 137);
		}
	}
</style>
