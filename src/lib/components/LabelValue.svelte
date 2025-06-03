<script lang="ts">
	import type { ClassValue } from 'svelte/elements';
	import { Icon, type IconSource } from '@steeze-ui/svelte-icon';
	import type { Snippet } from 'svelte';

	type BaseProps = {
		label: string;
		class?: ClassValue;
		title?: string;
		labelClass?: ClassValue;
		valueClass?: ClassValue;
		icon?: IconSource;
		iconClass?: ClassValue;
	};

	type WithValue = BaseProps & { value: string | number; children?: never };
	type WithChildren = BaseProps & { value?: never; children: Snippet };
	type Props = WithValue | WithChildren;

	let {
		label,
		value,
		children,
		class: className = 'flex items-center gap-x-1',
		title,
		labelClass,
		valueClass,
		icon,
		iconClass = 'h-5 w-5'
	}: Props = $props();
</script>

<svelte:element this={children ? "div" : "p"} class={className}>
	<!-- <p {title} class={className}> -->
		{#if icon}
			<Icon src={icon} class={iconClass} />
		{/if}
		<span class={['font-bold', labelClass]}>{label}:</span>
		<span class={valueClass}>
			{#if children}
				{@render children()}
			{:else}
				{value}
			{/if}
		</span>
	<!-- </p> -->
</svelte:element>
