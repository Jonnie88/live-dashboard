import { derived } from 'svelte/store';
import { forecast } from '$lib/stores/base/targetStore.js';
import { effectiveMinutes } from '$lib/stores/base/timeStore.js';
import { line1Capacity, line2Capacity } from '$lib/stores/base/capacityStore.js';

// Tempo (kolli/h)
export const speedPkth = derived([forecast, effectiveMinutes], ([$fc, $mins]) =>
	$mins > 0 ? Math.round(($fc * 60) / $mins) : 0
);

export const speedPkthExact = derived([forecast, effectiveMinutes], ([$fc, $mins]) =>
	$mins > 0 ? ($fc * 60) / $mins : 0
);

// (Valfritt) “hela-pass” S2-plan (om du vill behålla)
export const pktNeededFromL2 = derived(
	[forecast, line1Capacity, effectiveMinutes],
	([$fc, $cap1, $mins]) => $fc - ($mins / 60) * $cap1
);

export const s2RequiredMinutes = derived([pktNeededFromL2, line2Capacity], ([$need, $cap2]) => {
	const need = Math.max(0, Math.ceil($need));
	if ($cap2 <= 0) return Infinity;
	return Math.ceil((need / $cap2) * 60);
});
