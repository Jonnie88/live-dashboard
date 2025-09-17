<!-- src/components/BreaksToday.svelte -->
<script>
	import { breakStart, breakEnd } from '$lib/stores/base/timeStore.js';
	import { formatTime } from '$lib/stores/utils/time-helpers.js';

	function minutesBetween(start, end) {
		if (!start || !end) return 0;
		const ms = new Date(end).getTime() - new Date(start).getTime();
		return ms > 0 ? Math.floor(ms / 60000) : 0;
	}

	// reaktivt värde för längden
	$: breakMinutes = minutesBetween($breakStart, $breakEnd);
</script>

<div class="flex flex-col items-center justify-center rounded-lg bg-gray-200 p-4">
	<h2 class="mb-2 text-lg font-semibold">Rast</h2>
	<p class="text-3xl font-bold">{breakMinutes} min</p>
	<span class="mt-1 text-sm text-gray-700">
		{formatTime($breakStart)} – {formatTime($breakEnd)}
	</span>
</div>
