<script>
	import { forecast } from '$lib/stores/base/targetStore.js';
	import { totalProduced } from '$lib/stores/base/productionStore.js';
	import { percent } from '$lib/stores/derived/kpiStore.js';
	import UpdateProductionModal from '../components/UpdateProductionModal.svelte';

	const nf = new Intl.NumberFormat('sv-SE');
	$: clamped = Math.max(0, Math.min(100, $percent || 0));
	$: valueText = `${nf.format($totalProduced)} av ${nf.format($forecast)}`;

	// modal-öppnare + “senast uppdaterad”
	let showUpdate = false;
	let lastUpdated = null;

	function onSaved() {
		lastUpdated = new Date();
	}
</script>

<div class="col-span-2 rounded-lg bg-gray-200 p-4">
	<h2 class="mb-3 text-xl font-semibold">Producerat totalt / Mål</h2>

	<span class="rounded-md bg-white/30 py-1 text-xl">
		{nf.format($totalProduced)}/{nf.format($forecast)}
	</span>

	<div class="mt-3 flex items-center gap-3">
		<div class="h-3 flex-1 overflow-hidden rounded-full bg-white/40">
			<div
				class="h-full rounded-full bg-emerald-600 transition-all duration-500"
				style={`width: ${clamped}%;`}
				role="progressbar"
				aria-valuenow={clamped}
				aria-valuemin="0"
				aria-valuemax="100"
				aria-valuetext={valueText}
				title={valueText}
			></div>
		</div>
		<span class="text-sm font-medium">{clamped}%</span>
	</div>

	{#if lastUpdated}
		<div class="mt-1 text-right text-xs text-gray-600">
			Senast uppdaterad:
			{lastUpdated.toLocaleTimeString('sv-SE', {
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit'
			})}
		</div>
	{/if}

	<button
		class="mt-3 w-full rounded-md bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700 active:bg-emerald-800"
		type="button"
		on:click={() => (showUpdate = true)}
	>
		Uppdatera
	</button>
</div>

<!-- Reusable modal -->
<UpdateProductionModal bind:open={showUpdate} on:saved={onSaved} />
