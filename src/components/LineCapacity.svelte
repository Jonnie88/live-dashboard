<script>
	import { line1Capacity, line2Capacity } from '$lib/stores/base/capacityStore.js';
</script>

<div class="rounded-lg bg-gray-200 p-4">
	<h2 class="mb-3 text-center text-lg font-semibold">Kapacitet S1 / S2</h2>

	<div class="grid grid-cols-2 gap-4">
		<!-- S1 -->
		<div class="flex flex-col items-center rounded-md bg-white/40 p-3">
			<span class="text-sm font-medium">S1</span>
			<span class="text-2xl font-bold">{$line1Capacity} pkt/h</span>
		</div>

		<!-- S2 -->
		<div class="flex flex-col items-center rounded-md bg-white/40 p-3">
			<span class="text-sm font-medium">S2</span>
			<span class="text-2xl font-bold">{$line2Capacity} pkt/h</span>
		</div>
	</div>
</div>
