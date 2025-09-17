// src/lib/utils/persist.js
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * Generisk persisted store (JSON) med SSR-skydd och tab-sync.
 * serialize/deserialize kan bytas ut vid behov.
 */
export function persistedWritable(
	key,
	initialValue,
	{ serialize = JSON.stringify, deserialize = JSON.parse, throttleMs = 0 } = {}
) {
	let writeTimer = null;

	const store = writable(initialValue, (set) => {
		if (!browser) return;

		// Läs initialt
		const raw = localStorage.getItem(key);
		if (raw != null) {
			try {
				set(deserialize(raw));
			} catch {}
		}

		// Lyssna på förändringar från andra flikar
		const onStorage = (e) => {
			if (e.key === key) {
				if (e.newValue == null) set(initialValue);
				else {
					try {
						set(deserialize(e.newValue));
					} catch {}
				}
			}
		};
		window.addEventListener('storage', onStorage);
		return () => window.removeEventListener('storage', onStorage);
	});

	// Skriv tillbaka till localStorage
	if (browser) {
		store.subscribe((val) => {
			const write = () => {
				try {
					localStorage.setItem(key, serialize(val));
				} catch {}
			};
			if (throttleMs > 0) {
				clearTimeout(writeTimer);
				writeTimer = setTimeout(write, throttleMs);
			} else {
				write();
			}
		});
	}

	return store;
}

/** Persistad Date-store (lagras som ISO-sträng i localStorage). */
export function persistedDate(key, initialDate) {
	const isoInit = initialDate ? new Date(initialDate).toISOString() : null;
	const inner = persistedWritable(key, isoInit);

	return {
		subscribe: (run) => inner.subscribe((iso) => run(iso ? new Date(iso) : null)),
		set: (d) => inner.set(d ? new Date(d).toISOString() : null),
		update: (up) =>
			inner.update((iso) => {
				const cur = iso ? new Date(iso) : null;
				const next = up(cur);
				return next ? new Date(next).toISOString() : null;
			})
	};
}
