import { forecast } from '$lib/stores/base/targetStore.js';
import { line1Capacity, line2Capacity } from '$lib/stores/base/capacityStore.js';
import { lineStart, lineEnd, breakStart, breakEnd } from '$lib/stores/base/timeStore.js';

function getNextDayTimes() {
	const now = new Date();
	const nextDay = new Date(now);
	nextDay.setDate(now.getDate() + 1);

	const start = new Date(nextDay);
	start.setHours(0, 30, 0, 0); // 00:30

	const end = new Date(nextDay);
	end.setHours(5, 0, 0, 0); // 05:00

	return { start, end };
}

export function resetAll() {
	// 1. töm localStorage
	localStorage.clear();

	// 2. sätt defaultvärden
	forecast.set(0);
	line1Capacity.set(1400);
	line2Capacity.set(1400);

	const { start, end } = getNextDayTimes();
	lineStart.set(start);
	lineEnd.set(end);

	// Om raster har default – annars null
	breakStart.set(null);
	breakEnd.set(null);
}
