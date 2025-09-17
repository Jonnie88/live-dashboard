import { derived } from 'svelte/store';
import { persistedWritable } from '$lib/stores/utils/persist.js';

// Producerat (kolli)
export const line1 = persistedWritable('l1', 0);
export const line2 = persistedWritable('l2', 0);

// Historik
export const productionHistory = persistedWritable('hist', []); // [{ s1, s2, timestamp }]

export function addSample({ s1, s2, timestamp = Date.now() }) {
	const s1n = Math.floor(Number(s1) || 0);
	const s2n = Math.floor(Number(s2) || 0);
	const ts = Number.isFinite(timestamp) ? timestamp : Date.now();
	productionHistory.update((arr) => [...arr, { s1: s1n, s2: s2n, timestamp: ts }]);
}

// KPI
export const totalProduced = derived([line1, line2], ([$l1, $l2]) => ($l1 ?? 0) + ($l2 ?? 0));
