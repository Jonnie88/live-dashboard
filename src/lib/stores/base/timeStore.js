import { derived, readable } from 'svelte/store';
import { persistedWritable, persistedDate } from '$lib/stores/utils/persist.js';
import { minutesDiff, overlapMinutes, tomorrowAt } from '$lib/stores/utils/time-helpers.js';

// Pass (i morgon 00:30–05:00)
export const lineStart = persistedDate('ls', tomorrowAt(0, 30));
export const lineEnd = persistedDate('le', tomorrowAt(5, 0));

// Rast (i morgon 02:00–02:30)
export const breakStart = persistedDate('bs', tomorrowAt(2, 0));
export const breakEnd = persistedDate('be', tomorrowAt(2, 30));

// Tömningstid i slutet (min)
export const clearTime = persistedWritable('clear', 0);

// Effektiva minuter = (end-start) − rastOverlap − clearTime
export const effectiveMinutes = derived(
	[lineStart, lineEnd, breakStart, breakEnd, clearTime],
	([$s, $e, $bs, $be, $clear]) => {
		if (!($s && $e)) return 0;
		const total = minutesDiff($s, $e);
		const br = $bs && $be ? overlapMinutes($s, $e, $bs, $be) : 0;
		return Math.max(0, total - br - ($clear || 0));
	}
);

export const effectiveHHMM = derived(effectiveMinutes, (mins) => {
	const h = Math.floor(mins / 60),
		m = mins % 60;
	return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
});

// Effektivt slut
export const effectiveEnd = derived([lineEnd, clearTime], ([$end, $clear]) =>
	$end ? new Date($end.getTime() - ($clear || 0) * 60000) : null
);

// Live-klocka
export const now = readable(new Date(), (set) => {
	const id = setInterval(() => set(new Date()), 30000);
	return () => clearInterval(id);
});

// Status & nedräkning
export const isWithinLineWindow = derived([lineStart, lineEnd, now], ([$s, $e]) => {
	if (!($s && $e) || $e <= $s) return false;
	const t = Date.now();
	return t >= $s.getTime() && t < $e.getTime();
});

export const minutesUntilLineStart = derived([lineStart, now], ([$s, $now]) =>
	$s ? Math.max(0, Math.floor(($s.getTime() - $now.getTime()) / 60000)) : 0
);

export const hmUntilLineStart = derived(minutesUntilLineStart, (mins) => {
	const h = Math.floor(mins / 60),
		m = mins % 60;
	return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
});

export const untilLineStart = derived(minutesUntilLineStart, (mins) => ({
	h: Math.floor(mins / 60),
	m: mins % 60
}));

// Effektiv tid som passerat (för KPI “plan vs utfört”)
export const elapsedEffectiveMinutes = derived(
	[lineStart, effectiveEnd, breakStart, breakEnd, now],
	([$s, $effEnd, $bs, $be, $now]) => {
		if (!($s && $effEnd)) return 0;
		const capNow = new Date(Math.min(+$now, +$effEnd));
		if (capNow <= $s) return 0;

		const total = Math.max(0, Math.floor((+capNow - +$s) / 60000));
		let brOverlap = 0;
		if ($bs && $be) {
			const start = new Date(Math.max(+$s, +$bs));
			const end = new Date(Math.min(+capNow, +$be));
			if (end > start) brOverlap = Math.max(0, Math.floor((+end - +start) / 60000));
		}
		return Math.max(0, total - brOverlap);
	}
);
