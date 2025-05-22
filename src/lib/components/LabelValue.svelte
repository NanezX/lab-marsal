<script lang="ts">
	import type { ClassValue } from 'svelte/elements';

	type PropType = {
		label: string;
		value: string | number;
		class?: ClassValue;
		title?: string;
		labelClass?: ClassValue;
	};

	let { label, value, class: className, title, labelClass }: PropType = $props();
</script>

<p {title} class={className}>
	<span class={['font-bold', labelClass]}>{label}: </span>
	<span>{value}</span>
</p>
