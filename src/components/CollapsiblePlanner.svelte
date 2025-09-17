<script>
	import { slide } from 'svelte/transition';
	import {
		clearTime,
		lineStart,
		lineEnd,
		breakStart,
		breakEnd
	} from '$lib/stores/base/timeStore.js';

	import { line1Capacity, line2Capacity } from '$lib/stores/base/capacityStore.js';
	import { forecast } from '$lib/stores/base/targetStore.js';

	// Öppen/stängd
	export let open = false;

	// Helpers …
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
