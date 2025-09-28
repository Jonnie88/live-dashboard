<script>
	import { createEventDispatcher, tick } from 'svelte';
	import { fade, scale } from 'svelte/transition';

	export let open = false; // styr synlighet
	export let title = ''; // valfri rubrik
	export let closeOnBackdrop = true; // klick på overlay stänger
	export let closeOnEsc = true; // ESC stänger
	export let size = 'md'; // 'sm' | 'md' | 'lg' | 'xl'
	export let labelledBy = null; // aria-labelledby override

	const dispatch = createEventDispatcher();
	let dialogEl = null;
	const titleId = `modal-title-${Math.random().toString(36).slice(2, 8)}`;
	$: ariaLabelledby = labelledBy ?? (title ? titleId : undefined);

	function close() {
		if (!open) return;
		open = false;
		dispatch('close');
	}

	function handleBackdropClick(e) {
		if (!closeOnBackdrop) return;
		if (e.currentTarget === e.target) close(); // bara overlay-klick
	}

	function handleKeydown(e) {
		if (e.key === 'Escape' && closeOnEsc) {
			e.stopPropagation();
			close();
		}
	}

	$: if (open) {
		// fokus när modalen öppnas
		tick().then(() => dialogEl && dialogEl.focus());
		dispatch('open');
	}

	$: sizeClass =
		{ sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl' }[size] || 'max-w-md';
</script>

{#if open}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="fixed inset-0 z-50" on:keydown={handleKeydown} aria-hidden="false">
		<!-- Overlay -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="absolute inset-0 bg-black/50"
			on:click={handleBackdropClick}
			in:fade={{ duration: 120 }}
			out:fade={{ duration: 120 }}
		></div>

		<!-- Dialog -->
		<div
			class={`relative mx-auto mt-24 w-[92vw] ${sizeClass} rounded-xl bg-white p-5 text-gray-900 shadow-xl`}
			role="dialog"
			aria-modal="true"
			aria-labelledby={ariaLabelledby}
			tabindex="-1"
			bind:this={dialogEl}
			in:scale={{ duration: 150, start: 0.96 }}
			out:scale={{ duration: 120, start: 1 }}
		>
			<header class="mb-3 flex items-center justify-between">
				<slot name="header">
					{#if title}
						<h3 id={title ? titleId : undefined} class="text-lg font-semibold">{title}</h3>
					{/if}
				</slot>
				<button
					type="button"
					class="ml-4 rounded p-1 text-gray-600 hover:bg-gray-100 focus:ring focus:outline-none"
					aria-label="Stäng"
					on:click={close}>✕</button
				>
			</header>

			<div class="max-h-[70vh] overflow-auto">
				<slot />
			</div>

			<footer class="mt-5 flex justify-end gap-2">
				<slot name="footer">
					<button
						type="button"
						class="rounded-md bg-gray-200 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300"
						on:click={close}>Stäng</button
					>
				</slot>
			</footer>
		</div>
	</div>
{/if}
