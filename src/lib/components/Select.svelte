<script lang="ts" generics="T">
	import type { ClassValue } from 'svelte/elements';

	// Prop type
	type PropType = {
		name: string;
		value: T | null | undefined;
		items: T[];
		placeholder: string;
		title?: string;
		disabled?: boolean | null;
		required?: boolean;
		class?: ClassValue;
		forcePlaceholder?: boolean;
		formatter?: (item: T) => string;
	};

	// Prop deconstruct
	let {
		name,
		value = $bindable(),
		items,
		placeholder,
		title,
		disabled = false,
		required = false,
		class: classes,
		formatter,
		forcePlaceholder = false
	}: PropType = $props();

	// If placeholder should be shown, reset value to null
	if (forcePlaceholder) {
		value = null;
	}

	// Reusable classes
	const selectClass = [
		'bg-secondary-blue/30 focus:ring-dark-blue w-full rounded-3xl border py-2 px-4 focus:outline-hidden focus:ring-1',
		'disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600',
		classes,
		'border-r-8 border-transparent'
	];
</script>

<select bind:value {name} {required} class={selectClass} {title} {disabled}>
	<!-- Placeholder option, shown when value is null or undefined -->
	<option value={null} disabled>{placeholder}</option>

	{#each items as item}
		<option value={item}>
			{#if formatter}
				{formatter(item)}
			{:else}
				{item}
			{/if}
		</option>
	{/each}
</select>
