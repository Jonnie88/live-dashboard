<script>
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { productionHistory } from '$lib/stores/base/productionStore.js';

	let canvas;
	let chart;

	// Hjälpare
	const nf = new Intl.NumberFormat('sv-SE');

	// Bygg dataset av store-värden
	$: points = ($productionHistory ?? []).map((p) => ({
		x: p.timestamp, // tid på x-axeln
		y: (p.s1 ?? 0) + (p.s2 ?? 0) // total på y-axeln
	}));

	onMount(async () => {
		if (!browser) return;

		// Ladda Chart.js och tidsadapter bara i klient
		const ChartJS = (await import('chart.js/auto')).default;
		await import('chartjs-adapter-date-fns'); // för time-axel

		chart = new ChartJS(canvas.getContext('2d'), {
			type: 'line',
			data: {
				datasets: [
					{
						label: 'Total (S1 + S2)',
						data: points,
						parsing: false,
						borderWidth: 2,
						pointRadius: 0,
						tension: 0 // rak linje
					}
					// Vill du ha separata linjer:
					// {
					//   label: 'S1',
					//   data: ($productionHistory ?? []).map(p => ({ x: p.timestamp, y: p.s1 ?? 0 })),
					//   parsing: false, borderWidth: 1, pointRadius: 0, tension: 0
					// },
					// {
					//   label: 'S2',
					//   data: ($productionHistory ?? []).map(p => ({ x: p.timestamp, y: p.s2 ?? 0 })),
					//   parsing: false, borderWidth: 1, pointRadius: 0, tension: 0
					// }
				]
			},
			options: {
				animation: false,
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: {
						type: 'time',
						time: {
							// Visar bara tid, inte datum
							tooltipFormat: 'HH:mm:ss',
							displayFormats: { millisecond: 'HH:mm:ss', second: 'HH:mm:ss', minute: 'HH:mm' }
						},
						title: { display: true, text: 'Tid' }
					},
					y: {
						beginAtZero: true,
						title: { display: true, text: 'Kolli (totalt)' },
						ticks: { precision: 0 }
					}
				},
				plugins: {
					legend: { display: true, position: 'top' },
					tooltip: {
						callbacks: {
							label: (ctx) => ` ${nf.format(Math.round(ctx.parsed.y))} kolli`
						}
					}
				},
				elements: { line: { borderJoinStyle: 'round' } }
			}
		});
	});

	// Reaktiv uppdatering när historiken ändras
	$: if (chart) {
		chart.data.datasets[0].data = points;
		chart.update('none');
	}

	onDestroy(() => chart?.destroy());
</script>

<div style="height: 320px;">
	<canvas bind:this={canvas}></canvas>
</div>
