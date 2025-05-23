<script lang="ts">
	import type { ClassValue } from 'svelte/elements';
	import { Icon, type IconSource } from '@steeze-ui/svelte-icon';

	type PropType = {
		label: string;
		value: string | number;
		class?: ClassValue;
		title?: string;
		labelClass?: ClassValue;
		icon?: IconSource;
		iconClass?: ClassValue;
	};

	let {
		label,
		value,
		class: className = 'flex items-center gap-x-1',
		title,
		labelClass,
		icon,
		iconClass = 'h-5 w-5'
	}: PropType = $props();
</script>

<p {title} class={className}>
	{#if icon}
		<Icon src={icon} class={iconClass} />
	{/if}
	<span class={['font-bold', labelClass]}>{label}: </span>
	<span>{value}</span>
</p>
