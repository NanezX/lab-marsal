<script lang="ts">
	import type { Snippet } from 'svelte';

	// Prop type
	type PropType = {
		children: Snippet;
	};

	let { children }: PropType = $props();
</script>

<div class="flex max-w-96 items-center gap-x-4 p-2 text-lg text-black">
	{@render children()}
</div>
