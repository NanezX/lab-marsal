<script lang="ts" generics="T">
	import { isObject } from '$lib/shared/utils';
	import type { ClassValue } from 'svelte/elements';

	// Prop type
	type PropType = {
		name: string;
		value: T;
		items: T[];
		placeholder: string;
		title?: string;
		disabled?: boolean | null;
		required?: boolean;
		class?: ClassValue;
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
		formatter
	}: PropType = $props();

	// If this cause future issues, the issue comes from the zod validation at role. This is required and .nativeEnum
	// provide, as default value, the first element at the enum. This cause that the select never start with a "empty" state
	// which does not starting showing the placeholder.
	// @ts-expect-error This is to allow the select to start at the placehorder
	value = '';

	// Reusable classes
	const selectClass = [
		'bg-secondary-blue/30 focus:ring-dark-blue w-full rounded-3xl border py-2 px-4 focus:outline-none focus:ring-1',
		'disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600',
		classes,
		'border-r-8 border-transparent'
	];
</script>

<select bind:value {name} {required} class={selectClass} {title} {disabled}>
	<!-- Default option -->
	<option value="" disabled selected>{placeholder}</option>

	{#each items as item}
		<option value={item}>
			<!-- The consumer decide how to display the data -->
			{#if formatter}
				{formatter(item)}
			{:else}
				{item}
			{/if}
		</option>
	{/each}
</select>
