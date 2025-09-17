<!-- src/components/EffectiveTime.svelte -->
<script>
	import {
		clearTime,
		lineStart,
		lineEnd,
		breakStart,
		breakEnd,
		effectiveHHMM,
		effectiveEnd
	} from '$lib/stores/base/timeStore.js';

	const fmtHM = (d) =>
		d ? new Date(d).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }) : '–';

	// Räkna exakt hur många minuter av rasten som överlappar passet
	$: breakOverlapMin = (() => {
		if (!($lineStart && $lineEnd && $breakStart && $breakEnd)) return 0;
		const s = Math.max(+$lineStart, +$breakStart);
		const e = Math.min(+$lineEnd, +$breakEnd);
		return e > s ? Math.floor((e - s) / 60000) : 0;
	})();

	// Visa en liten varning om rasten ligger helt utanför passet
	$: breakOutside = $breakStart && $breakEnd && breakOverlapMin === 0;
</script>

<div class="flex flex-col items-center justify-center rounded-lg bg-gray-200 p-4">
	<h2 class="mb-2 text-lg font-semibold">Effektiv tid</h2>

	<p class="text-3xl font-bold">{$effectiveHHMM}</p>

	<div class="mt-1 text-sm text-gray-700">
		{fmtHM($lineStart)} – {fmtHM($lineEnd)}
	</div>

	{#if breakOutside}
		<div class="mt-2 text-xs text-amber-700">
			Obs: rasten ligger utanför passet och påverkar inte effektiv tid.
		</div>
	{/if}
</div>
