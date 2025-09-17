<script>
	import { slide } from 'svelte/transition';

	export let open = false; // controls visibility
	export let title = 'Planeringsformulär'; // fallback if you don't pass a header slot

	$: chevron = open ? '▲' : '▼';
</script>

<div class="mx-4 mb-2 rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
	<!-- Header / Toggle -->
	<button
		type="button"
		class="flex w-full items-center justify-between gap-3 rounded-lg px-4 py-3 text-left hover:bg-gray-50"
		on:click={() => (open = !open)}
		aria-expanded={open}
		aria-controls="collapsible-content"
	>
		<div class="flex items-center gap-2">
			<!-- Named header slot, falls back to title -->
			<slot name="header">
				<span class="text-sm font-semibold text-gray-900">{title}</span>
			</slot>
		</div>
		<span class="text-xs text-gray-500">{chevron}</span>
	</button>

	{#if open}
		<div id="collapsible-content" class="border-t border-gray-200 px-4 py-4" in:slide out:slide>
			<!-- Your form (or anything) goes here -->
			<slot />
		</div>
	{/if}
</div>
