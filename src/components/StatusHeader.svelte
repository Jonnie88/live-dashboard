<script>
	import { plannedProducedSoFarExact } from '$lib/stores/derived/progressStore.js';
	import { resetAll } from '$lib/stores/reset.js';
	import { forecast } from '$lib/stores/base/targetStore.js';
	import { untilLineStart, isWithinLineWindow } from '$lib/stores/base/timeStore.js';
	import { totalProduced } from '$lib/stores/base/productionStore.js';

	function onReset() {
		if (confirm('Vill du återställa till grundläge?')) {
			resetAll();
			// Valfritt: ladda om sidan helt för att rensa UI
			location.reload();
		}
	}

	const nf = new Intl.NumberFormat('sv-SE');

	// Diff mot plan
	$: diffExact = ($totalProduced ?? 0) - ($plannedProducedSoFarExact ?? 0);
	$: diffInt = Math.round(diffExact);
	$: sign = diffInt > 0 ? '+' : diffInt < 0 ? '−' : '±';
	$: diffAbs = Math.abs(diffInt);

	// Mål
	$: remaining = Math.max(0, ($forecast ?? 0) - ($totalProduced ?? 0));
	$: goalReached = ($totalProduced ?? 0) >= ($forecast ?? 0);

	// Faser + tema
	$: phase = $isWithinLineWindow ? 'running' : $untilLineStart.started ? 'done' : 'before';
	const theme = {
		running: {
			bg: 'bg-emerald-600',
			badge: 'bg-emerald-700',
			accent: 'bg-black/20',
			status: 'IGÅNG'
		},
		before: {
			bg: 'bg-amber-500',
			badge: 'bg-amber-600',
			accent: 'bg-black/20',
			status: 'STARTAR SNART'
		},
		done: { bg: 'bg-slate-500', badge: 'bg-slate-600', accent: 'bg-black/20', status: 'AVSLUTAT' }
	};

	// --- FIX: deklarera och uppdatera reaktivt (utan destructuring) ---
	let containerBg = '',
		badgeBg = '',
		accentBg = '',
		status = '';
	$: containerBg = theme[phase].bg;
	$: badgeBg = theme[phase].badge;
	$: accentBg = theme[phase].accent;
	$: status = theme[phase].status;

	// Färg för diff-badge när vi kör
	$: diffBadge = diffInt > 0 ? 'bg-emerald-600' : diffInt < 0 ? 'bg-rose-600' : 'bg-black/20';
</script>

<div
	class={`col-span-4 flex w-full items-center justify-between gap-4 rounded-lg p-4 text-white ${containerBg} transition-colors`}
>
	<!-- Status -->
	<span class={`rounded px-3 py-1 text-sm font-semibold ${badgeBg}`}>{status}</span>

	<!-- Mitten -->
	<div class="flex flex-1 items-center justify-center gap-4" aria-live="polite">
		{#if phase === 'before'}
			<div class="text-sm md:text-base">
				Start om: <strong>{$untilLineStart.h} h {$untilLineStart.m} min</strong>
			</div>
			<span class={`rounded ${accentBg} px-3 py-1 text-sm font-semibold`}>
				{nf.format($totalProduced)}/{nf.format($forecast)}
			</span>
		{:else if phase === 'running'}
			{#if goalReached}
				<div class="text-sm md:text-base">
					✅ Mål uppnått — <strong>{nf.format($totalProduced)}</strong> / {nf.format($forecast)}
				</div>
			{:else}
				<div class="text-sm md:text-base">
					Kvar till mål: <strong>{nf.format(remaining)}</strong>
				</div>
			{/if}
			<span class={`rounded ${diffBadge} px-3 py-1 text-sm font-semibold`}>
				{sign}
				{nf.format(Math.abs(diffInt))}
			</span>
		{:else}
			<div class="text-sm md:text-base">Passet är avslutat</div>
			<span class={`rounded ${accentBg} px-3 py-1 text-sm font-semibold`}>
				Utfört: <strong>{nf.format($totalProduced)}</strong> / {nf.format($forecast)}
			</span>
		{/if}
	</div>

	<button class="rounded-lg bg-red-600 px-3 py-1.5 text-white hover:bg-red-700" on:click={onReset}>
		Återställ
	</button>
</div>
