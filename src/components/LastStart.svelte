<script>
	import {
		s2RequiredMinutesAtUpdate,
		pktNeededFromL2AtUpdate,
		s2LatestStartAtUpdateHM
	} from '$lib/stores/planning/snapshotStore.js';
</script>

<div class="flex flex-col items-center justify-center rounded-lg bg-gray-200 p-4">
	<h2 class="mb-2 text-lg font-semibold">Senaste start S2</h2>

	{#if $pktNeededFromL2AtUpdate === null}
		<p class="text-sm text-gray-600">Ingen uppdatering ännu</p>
	{:else if $pktNeededFromL2AtUpdate === 0}
		<p class="text-xl font-semibold text-emerald-700">Bana 2 behövs ej</p>
	{:else if $s2RequiredMinutesAtUpdate === Infinity}
		<p class="text-sm text-red-600">Målet kan inte nås (S2-kapacitet 0)</p>
	{:else if $s2LatestStartAtUpdateHM}
		<p class="text-2xl font-bold">{$s2LatestStartAtUpdateHM}</p>
		<span class="text-xs text-gray-700">
			S2 behöver ca {$s2RequiredMinutesAtUpdate} min (behov: {$pktNeededFromL2AtUpdate} kolli)
		</span>
	{:else}
		<p class="text-sm text-gray-600">Ingen giltig beräkning</p>
	{/if}
</div>
