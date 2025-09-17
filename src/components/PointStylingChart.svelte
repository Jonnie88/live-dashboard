<!-- src/lib/components/ProductionHistoryLine.svelte -->
<script>
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { lineStart, lineEnd } from '$lib/stores/base/timeStore.js';
	import { forecast } from '$lib/stores/base/targetStore.js';
	import { productionHistory } from '$lib/stores/base/productionStore.js';

	export let height = 320;
	export let yPadding = 1000; // extra ovanför forecast
	export let yMin = 0;

	let canvas;
	let chart;

	// Helpers (30-min tickar)
	const ONE_HOUR = 60 * 60 * 1000;
	const HALF_HOUR = 30 * 60 * 1000;
	const floorTo = (ts, step) => Math.floor(ts / step) * step;
	const ceilTo = (ts, step) => Math.ceil(ts / step) * step;

	// Bygg punkter: total (S1+S2) över tid
	$: totalPoints = ($productionHistory ?? [])
		.map((p) => ({ x: p.timestamp, y: (p.s1 ?? 0) + (p.s2 ?? 0) }))
		.sort((a, b) => a.x - b.x);

	// Data-domän (fallback om passet inte täcker)
	$: hasData = totalPoints.length > 0;
	$: dataMin = hasData ? totalPoints[0].x : Date.now() - ONE_HOUR;
	$: dataMax = hasData ? totalPoints[totalPoints.length - 1].x : Date.now();

	// ❗ Bara +30 min i slutet (ingen padding i början)
	$: startRaw = $lineStart ? $lineStart.getTime() : dataMin;
	$: endRaw = $lineEnd ? $lineEnd.getTime() : dataMax;

	$: xMinRaw = Math.min(startRaw, dataMin); // ingen extra padding
	$: xMaxRaw = Math.max(endRaw, dataMax) + HALF_HOUR; // +30 min efter

	// Runda till närmsta 30-min
	$: xMin = floorTo(xMinRaw, HALF_HOUR);
	$: xMax = ceilTo(xMaxRaw, HALF_HOUR);

	// Y-max = forecast + padding, men minst något över datapunkternas max
	$: yDataMax = hasData ? Math.max(...totalPoints.map((p) => p.y)) : 0;
	$: yMaxFromForecast = (Number($forecast ?? 0) || 0) + yPadding;
	$: yMax = Math.max(yMin + 1, yMaxFromForecast, yDataMax + Math.ceil(yDataMax * 0.1));

	onMount(async () => {
		if (!browser) return;
		const ChartJS = (await import('chart.js/auto')).default;

		chart = new ChartJS(canvas.getContext('2d'), {
			type: 'line',
			data: {
				datasets: [
					{
						label: 'Total (S1 + S2)',
						data: totalPoints,
						parsing: false, // vi skickar {x,y}
						borderWidth: 2,
						pointRadius: 0,
						tension: 0 // rak linje
					}
				]
			},
			options: {
				animation: false,
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: { display: true, position: 'top' },
					tooltip: {
						callbacks: {
							title: (items) => {
								const t = items?.[0]?.parsed?.x;
								return t
									? new Date(t).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
									: '';
							},
							label: (ctx) => ` ${Math.round(ctx.parsed.y)} kolli`
						}
					}
				},
				scales: {
					x: {
						type: 'linear', // ms → stabila 30-min tickar
						min: xMin,
						max: xMax,
						ticks: {
							stepSize: HALF_HOUR,
							callback: (v) =>
								new Date(v).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
						},
						title: { display: true, text: 'Tid' }
					},
					y: {
						type: 'linear',
						min: yMin,
						max: yMax,
						ticks: { precision: 0 },
						title: { display: true, text: 'Kolli (totalt)' }
					}
				},
				elements: { line: { borderJoinStyle: 'round' } }
			}
		});
	});

	// Reaktiva uppdateringar
	$: if (chart) {
		chart.options.scales.x.min = xMin;
		chart.options.scales.x.max = xMax;
		chart.options.scales.y.min = yMin;
		chart.options.scales.y.max = yMax;
		chart.data.datasets[0].data = totalPoints;
		chart.update('none');
	}

	onDestroy(() => chart?.destroy());
</script>

<div style="height: {height}px;">
	<canvas bind:this={canvas}></canvas>
</div>

{#if !hasData}
	<div class="mt-2 text-center text-xs text-gray-500">Ingen historik att visa.</div>
{/if}
