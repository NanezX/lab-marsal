<script lang="ts">
	import type { ClassValue } from 'svelte/elements';

	// Prop type
	type PropType = {
		element?: 'div' | 'span';
		class?: ClassValue;
	};

	let { class: className, element = 'div' }: PropType = $props();
</script>

<svelte:element this={element} role="status" class="w-fit">
	<svg
		aria-hidden="true"
		class={['animatespin h-4 w-4 text-primary-blue', className]}
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
		></circle>
		<path
			class="opacity-75"
			fill="currentColor"
			d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
		></path>
	</svg>
</svelte:element>
