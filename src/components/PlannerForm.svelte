<script>
	import {
		clearTime,
		lineStart,
		lineEnd,
		breakStart,
		breakEnd
	} from '$lib/stores/base/timeStore.js';
	import { line1Capacity, line2Capacity } from '$lib/stores/base/capacityStore.js';
	import { forecast } from '$lib/stores/base/targetStore.js';

	// Helpers
	const pad = (n) => String(n).padStart(2, '0');
	const toLocalDatetime = (d) => {
		if (!d) return '';
		const dt = new Date(d);
		return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
	};
	const toDate = (s) => {
		const d = new Date(s);
		return Number.isNaN(d.getTime()) ? null : d;
	};
	const toNonNegInt = (v) => Math.max(0, Math.floor(Number(v) || 0));
	const toNonNegNum = (v) => Math.max(0, Number(v) || 0);
</script>

<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
	<!-- Forecast -->
	<label class="space-y-1">
		<span class="text-xs text-gray-600">Mål (forecast, kolli)</span>
		<input
			type="number"
			min="0"
			class="w-full rounded border px-3 py-2"
			value={$forecast}
			on:input={(e) => forecast.set(toNonNegInt(e.currentTarget.value))}
			inputmode="numeric"
		/>
	</label>

	<!-- Kapaciteter -->
	<label class="space-y-1">
		<span class="text-xs text-gray-600">S1 kapacitet (pkt/h)</span>
		<input
			type="number"
			min="0"
			class="w-full rounded border px-3 py-2"
			value={$line1Capacity}
			on:input={(e) => line1Capacity.set(toNonNegInt(e.currentTarget.value))}
			inputmode="numeric"
		/>
	</label>

	<label class="space-y-1">
		<span class="text-xs text-gray-600">S2 kapacitet (pkt/h)</span>
		<input
			type="number"
			min="0"
			class="w-full rounded border px-3 py-2"
			value={$line2Capacity}
			on:input={(e) => line2Capacity.set(toNonNegInt(e.currentTarget.value))}
			inputmode="numeric"
		/>
	</label>

	<!-- Tömningstid -->
	<label class="space-y-1">
		<span class="text-xs text-gray-600">Tömningstid (min)</span>
		<input
			type="number"
			min="0"
			class="w-full rounded border px-3 py-2"
			value={$clearTime}
			on:input={(e) => clearTime.set(toNonNegNum(e.currentTarget.value))}
			inputmode="numeric"
		/>
	</label>

	<!-- Start/Slut -->
	<label class="space-y-1 sm:col-span-2 lg:col-span-2">
		<span class="text-xs text-gray-600">Start (datum + tid)</span>
		<input
			type="datetime-local"
			class="w-full rounded border px-3 py-2"
			value={toLocalDatetime($lineStart)}
			on:change={(e) => {
				const d = toDate(e.currentTarget.value);
				if (d) lineStart.set(d);
			}}
		/>
	</label>

	<label class="space-y-1 sm:col-span-2 lg:col-span-2">
		<span class="text-xs text-gray-600">Slut (datum + tid)</span>
		<input
			type="datetime-local"
			class="w-full rounded border px-3 py-2"
			value={toLocalDatetime($lineEnd)}
			on:change={(e) => {
				const d = toDate(e.currentTarget.value);
				if (d) lineEnd.set(d);
			}}
		/>
	</label>

	<!-- Rast -->
	<label class="space-y-1">
		<span class="text-xs text-gray-600">Rast start</span>
		<input
			type="datetime-local"
			class="w-full rounded border px-3 py-2"
			value={toLocalDatetime($breakStart)}
			on:change={(e) => {
				const d = toDate(e.currentTarget.value);
				if (d) breakStart.set(d);
			}}
		/>
	</label>

	<label class="space-y-1">
		<span class="text-xs text-gray-600">Rast slut</span>
		<input
			type="datetime-local"
			class="w-full rounded border px-3 py-2"
			value={toLocalDatetime($breakEnd)}
			on:change={(e) => {
				const d = toDate(e.currentTarget.value);
				if (d) breakEnd.set(d);
			}}
		/>
	</label>
</div>

<!-- Liten hint-rad -->
<div class="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-600">
	<span
		>Pass:
		<strong>{toLocalDatetime($lineStart).replace('T', ' ')}</strong> →
		<strong>{toLocalDatetime($lineEnd).replace('T', ' ')}</strong>
	</span>
	<span class="hidden sm:inline">•</span>
	<span
		>Rast:
		<strong>{toLocalDatetime($breakStart).split('T')[1] || '—'}</strong>–<strong
			>{toLocalDatetime($breakEnd).split('T')[1] || '—'}</strong
		>
	</span>
</div>
