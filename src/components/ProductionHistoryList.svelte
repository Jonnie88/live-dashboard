<!-- src/lib/components/ProductionHistoryList.svelte -->
<script>
	import { productionHistory } from '$lib/stores/base/productionStore.js';

	// Visa bara sista N raderna (0 = alla)
	export let limit = 0;

	// Antal rader innan scroll aktiveras
	export let scrollThreshold = 5;

	const nf = new Intl.NumberFormat('sv-SE');
	const tf = new Intl.DateTimeFormat('sv-SE', { hour: '2-digit', minute: '2-digit' });

	// Sortera historik
	$: points = ($productionHistory ?? []).slice().sort((a, b) => a.timestamp - b.timestamp);

	// Bygg rader: { ts, time, total, speed }
	$: rows = points.map((p, i, arr) => {
		const total = (p.s1 ?? 0) + (p.s2 ?? 0);
		if (i === 0) return { ts: p.timestamp, time: tf.format(p.timestamp), total, speed: null };

		const prev = arr[i - 1];
		const prevTotal = (prev.s1 ?? 0) + (prev.s2 ?? 0);
		const delta = total - prevTotal;
		const dtMin = Math.max(1, Math.floor((p.timestamp - prev.timestamp) / 60000)); // undvik 0
		const speed = (delta / dtMin) * 60; // pkt/h

		return { ts: p.timestamp, time: tf.format(p.timestamp), total, speed };
	});

	// Begränsa visning
	$: shown = limit > 0 ? rows.slice(-limit) : rows;

	// Scroll aktiv?
	$: isScrollable = shown.length > scrollThreshold;

	// (valfritt) medelhastighet
	$: avgSpeed =
		rows.length > 1
			? ((rows.at(-1).total - rows[0].total) / Math.max(1, (rows.at(-1).ts - rows[0].ts) / 60000)) *
				60
			: 0;
</script>

<div class="rounded-lg bg-gray-200 p-4">
	<h2 class="mb-3 text-lg font-semibold">Historik (Total / Hastighet)</h2>

	<!-- Scrollbar när fler än scrollThreshold rader -->
	<div class="rounded border bg-white">
		<div class="overflow-auto" class:max-h-64={isScrollable}>
			<table class="min-w-full text-sm">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-3 py-2 text-left">Tid</th>
						<th class="px-3 py-2 text-right">Total</th>
						<th class="px-3 py-2 text-right">Hastighet</th>
					</tr>
				</thead>
				<tbody>
					{#if shown.length === 0}
						<tr>
							<td colspan="3" class="px-3 py-4 text-center text-gray-500">Ingen historik.</td>
						</tr>
					{:else}
						{#each shown as r}
							<tr class="border-t">
								<td class="px-3 py-2">{r.time}</td>
								<td class="px-3 py-2 text-right">{nf.format(r.total)}</td>
								<td class="px-3 py-2 text-right">
									{r.speed == null ? '—' : `${nf.format(Math.round(r.speed))} pkt/h`}
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>

	{#if rows.length > 1}
		<div class="mt-2 text-xs text-gray-600">
			Medelhastighet: <strong>{nf.format(Math.round(avgSpeed))} pkt/h</strong>
		</div>
	{/if}
</div>
