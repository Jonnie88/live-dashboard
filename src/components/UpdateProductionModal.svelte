<script>
	import Modal from '../components/Modal.svelte';
	import { line1, line2 } from '$lib/stores/base/productionStore.js';
	import { productionHistory } from '$lib/stores/base/productionStore.js';
	import { get } from 'svelte/store';

	export let open = false; // parent controls visibility via bind:open
	export let title = 'Uppdatera produktion';

	let s1Value = 0;
	let s2Value = 0;
	let errorMsg = '';

	function handleOpen() {
		s1Value = get(line1) ?? 0;
		s2Value = get(line2) ?? 0;
		errorMsg = '';
	}

	function handleClose() {
		open = false;
	}

	function save() {
		const v1 = Number(s1Value);
		const v2 = Number(s2Value);

		if (!(Number.isFinite(v1) && v1 >= 0 && Number.isFinite(v2) && v2 >= 0)) {
			errorMsg = 'Ange giltiga icke-negativa tal för S1 och S2.';
			return;
		}

		const s1 = Math.floor(v1);
		const s2 = Math.floor(v2);

		line1.set(s1);
		line2.set(s2);

		productionHistory.update((arr) => [...arr, { s1, s2, timestamp: Date.now() }]);

		open = false;
	}
</script>

<Modal bind:open {title} on:open={handleOpen} on:close={handleClose}>
	{#if errorMsg}
		<div class="mb-3 rounded bg-red-100 px-3 py-2 text-sm text-red-700">{errorMsg}</div>
	{/if}

	<form class="space-y-3" on:submit|preventDefault={save}>
		<label class="block">
			<span class="text-sm text-gray-700">Producerat S1 (kolli)</span>
			<input
				type="number"
				class="mt-1 w-full rounded border px-3 py-2"
				min="0"
				step="1"
				bind:value={s1Value}
				inputmode="numeric"
			/>
		</label>

		<label class="block">
			<span class="text-sm text-gray-700">Producerat S2 (kolli)</span>
			<input
				type="number"
				class="mt-1 w-full rounded border px-3 py-2"
				min="0"
				step="1"
				bind:value={s2Value}
				inputmode="numeric"
			/>
		</label>
	</form>

	<div slot="footer" class="flex gap-2">
		<button
			type="button"
			class="rounded-md bg-gray-200 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300"
			on:click={handleClose}>Avbryt</button
		>
		<button
			type="submit"
			class="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
			on:click={save}>Spara</button
		>
	</div>
</Modal>
