<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	type PropType = {
		children: Snippet;
		class?: ClassValue;
	};

	const { children, class: className }: PropType = $props();
</script>

<div class={['mx-auto shadow-2xl', className]}>
	{@render children()}
</div>
