export function minutesDiff(start, end) {
	return Math.max(0, Math.floor((+end - +start) / 60000));
}

export function overlapMinutes(aStart, aEnd, bStart, bEnd) {
	const start = new Date(Math.max(+aStart, +bStart));
	const end = new Date(Math.min(+aEnd, +bEnd));
	return start < end ? minutesDiff(start, end) : 0;
}

export function formatTime(date) {
	if (!date) return '';
	const d = new Date(date);
	return new Intl.DateTimeFormat('sv-SE', { hour: '2-digit', minute: '2-digit' }).format(d);
}

export function tomorrowAt(h, m) {
	const now = new Date();
	return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, h, m, 0, 0);
}
