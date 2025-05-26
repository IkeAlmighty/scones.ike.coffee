<script>
	let openDates = getSaturdaysExcludingFirst();

	function getSaturdaysExcludingFirst(start = new Date()) {
		const end = new Date(start.getFullYear(), 9, 1); // Dec 1 = start of winter
		const saturdays = [];

		// Start from the next Saturday (or today if it's Saturday)
		let current = new Date(start);
		current.setHours(0, 0, 0, 0);
		current.setDate(current.getDate() + ((6 - current.getDay() + 7) % 7));

		while (current < end) {
			const month = current.getMonth();
			const year = current.getFullYear();

			// Find the first Saturday of this month
			const firstOfMonth = new Date(year, month, 1);
			const firstSaturday = new Date(firstOfMonth);
			const dayOfWeek = firstOfMonth.getDay();
			firstSaturday.setDate(1 + ((6 - dayOfWeek + 7) % 7));

			// If not the first Saturday of the month, include it
			if (
				current.getDate() !== firstSaturday.getDate() ||
				current.getMonth() !== firstSaturday.getMonth()
			) {
				saturdays.push(new Date(current));
			}

			current.setDate(current.getDate() + 7); // move to next Saturday
		}

		return saturdays;
	}

	function toRFC5545(date) {
		const pad = (n) => String(n).padStart(2, '0');

		return (
			date.getUTCFullYear().toString() +
			pad(date.getUTCMonth() + 1) +
			pad(date.getUTCDate()) +
			'T' +
			pad(date.getUTCHours()) +
			pad(date.getUTCMinutes()) +
			pad(date.getUTCSeconds()) +
			'Z'
		);
	}

	function generateCalendarLink(day) {
		function get8amAnd12pm(date) {
			const _year = date.getFullYear();
			const _month = date.getMonth(); // 0-based
			const _day = date.getDate();

			const eightAM = new Date(_year, _month, _day, 8, 0, 0, 0);
			const twelvePM = new Date(_year, _month, _day, 12, 0, 0, 0);

			return [toRFC5545(eightAM), toRFC5545(twelvePM)];
		}

		let [start, end] = get8amAnd12pm(day);

		const href = `
    https://calendar.google.com/calendar/u/0/r/eventedit?&text=ike's Scones&dates=${start}/${end}&details=Shop for scones with ike!&location=3825 5th Ave S, Minneapolis MN
`;

		return href;
	}
</script>

<div class="container">
	{#each openDates as day}
		<div class="date">
			<a href={generateCalendarLink(day)} target="_blank">
				{day.toDateString()}
				🔗
			</a>
		</div>
	{/each}
</div>

<style>
	.container {
		display: flex;
		flex-wrap: wrap;
	}
	.date {
		margin: 1rem auto;
		width: 50%;
		text-align: center;
	}

	a {
		cursor: pointer;
		text-decoration: none;
		color: inherit;
	}
</style>
