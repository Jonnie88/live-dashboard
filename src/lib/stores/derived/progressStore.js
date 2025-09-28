import { derived } from 'svelte/store';
import { speedPkthExact, speedPkth } from '$lib/stores/planning/planningStore.js'; // planerat tempo
import { elapsedEffectiveMinutes } from '$lib/stores/base/timeStore.js'; // passerad effektiv tid

export const plannedProducedSoFarExact = derived(
	[speedPkthExact, speedPkth, elapsedEffectiveMinutes],
	([$rateExact, $rateInt, $mins]) => {
		const rate = Number.isFinite($rateExact) && $rateExact > 0 ? $rateExact : $rateInt;
		return rate > 0 ? (rate * $mins) / 60 : 0;
	}
);
