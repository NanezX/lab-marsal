<script lang="ts">
	import type { ClassValue } from 'svelte/elements';

	type PropType = {
		label: string;
		value: string | number;
		class?: ClassValue;
		title?: string;
	};

	let { label, value, class: className, title }: PropType = $props();
</script>

<p {title} class={className}>
	<span class="font-semibold">{label}: </span>
	<span>{value}</span>
</p>
