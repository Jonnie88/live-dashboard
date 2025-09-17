import { derived, get } from 'svelte/store';
import { forecast } from '$lib/stores/base/targetStore.js';
import { line1, line2 } from '$lib/stores/base/productionStore.js';
import { line1Capacity, line2Capacity } from '$lib/stores/base/capacityStore.js';
import { lineStart, breakStart, breakEnd, effectiveEnd } from '$lib/stores/base/timeStore.js';
import { persistedWritable, persistedDate } from '$lib/stores/utils/persist.js';

// Snapshot-markörer
export const lastUpdateAt = persistedDate('upd_at', null);
export const remainingForecastAtUpdate = persistedWritable('upd_remain', null);

// Kvarvarande effektiv tid från lastUpdateAt → effectiveEnd
export const remainingEffectiveMinutesAtUpdate = derived(
	[lineStart, effectiveEnd, breakStart, breakEnd, lastUpdateAt],
	([$s, $effEnd, $bs, $be, $at]) => {
		if (!($s && $effEnd && $at)) return 0;
		const from = new Date(Math.max(+$s, +$at));
		if (from >= $effEnd) return 0;

		const total = Math.floor((+$effEnd - +from) / 60000);
		let br = 0;
		if ($bs && $be) {
			const rs = new Date(Math.max(+from, +$bs));
			const re = new Date(Math.min(+$effEnd, +$be));
			if (re > rs) br = Math.floor((+re - +rs) / 60000);
		}
		return Math.max(0, total - br);
	}
);

// S1:s möjliga kvarvarande output (kolli)
export const s1RemainingCapacityKolliAtUpdate = derived(
	[line1Capacity, remainingEffectiveMinutesAtUpdate],
	([$cap1, $mins]) => ($cap1 > 0 && $mins > 0 ? ($cap1 * $mins) / 60 : 0)
);

// Behov från S2 (kolli)
export const pktNeededFromL2AtUpdate = derived(
	[remainingForecastAtUpdate, s1RemainingCapacityKolliAtUpdate],
	([$remain, $s1cap]) => {
		if ($remain == null) return null;
		return Math.max(0, Math.ceil(($remain ?? 0) - ($s1cap ?? 0)));
	}
);

// S2-tid som krävs (min)
export const s2RequiredMinutesAtUpdate = derived(
	[pktNeededFromL2AtUpdate, line2Capacity],
	([$need, $cap2]) => {
		if ($need == null) return null;
		if ($need <= 0) return 0;
		if (!Number.isFinite($cap2) || $cap2 <= 0) return Infinity;
		return Math.ceil(($need / $cap2) * 60);
	}
);

// Senaste start = effectiveEnd − S2-minuter
export const s2LatestStartAtUpdate = derived(
	[s2RequiredMinutesAtUpdate, effectiveEnd, pktNeededFromL2AtUpdate],
	([$mins, $effEnd, $need]) => {
		if ($need == null) return null;
		if (!$effEnd || !Number.isFinite($mins) || $need <= 0) return null;
		return new Date($effEnd.getTime() - $mins * 60000);
	}
);

export const s2LatestStartAtUpdateHM = derived(s2LatestStartAtUpdate, (d) =>
	d ? new Intl.DateTimeFormat('sv-SE', { hour: '2-digit', minute: '2-digit' }).format(d) : ''
);

export const isS2NeededAtUpdate = derived([pktNeededFromL2AtUpdate], ([$need]) => ($need ?? 0) > 0);

// Anropa denna i din modal när du sparar nya line1/line2
export function markProductionUpdated(at = new Date()) {
	lastUpdateAt.set(at);
	const remain = Math.max(0, (get(forecast) ?? 0) - ((get(line1) ?? 0) + (get(line2) ?? 0)));
	remainingForecastAtUpdate.set(remain);
}
