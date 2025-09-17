<script>
	import { speedPkth } from '$lib/stores/planning/planningStore.js';
</script>

<div class="flex flex-col items-center justify-center rounded-lg bg-gray-200 p-4">
	<h2 class="mb-2 text-lg font-semibold">Planerat tempo</h2>
	<p class="text-3xl font-bold">{$speedPkth}</p>
	<span class="text-sm text-gray-700">pkt/h</span>
</div>
