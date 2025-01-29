<script lang="ts">
	import type { ClassValue } from 'svelte/elements';

	// Prop type
	type PropType = {
		class?: ClassValue;
	};

	let { class: className }: PropType = $props();

	const classes = [
		'h-8 w-8 border-4 animate-spin rounded-[50%] border-solid border-primary-blue/30 border-t-primary-blue',
		className
	];
</script>

<span class={classes}></span>
