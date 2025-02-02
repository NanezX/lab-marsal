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
		// This `key` is to access to a that value if `T` is an object to display it
		key?: string;
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
		key
	}: PropType = $props();

	// Reusable classes
	const selectClass = [
		'bg-secondary-blue/30 focus:ring-dark-blue w-full rounded-3xl border py-2 px-4 focus:outline-none focus:ring-1',
		'disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600',
		classes
	];
</script>

<!-- TODO: Instead of using a `key`, accept as props a formatter function that will let the consumer to pass how the values should be displayed -->
<select bind:value {name} {required} class={selectClass} {title} {disabled}>
	<!-- Default option -->
	<option value="" disabled selected>{placeholder}</option>

	{#each items as item}
		<option value={item}>
			{#if key && isObject(item)}
				<!-- This is just redering the first children -->
				{item[key]}
			{:else}
				{item}
			{/if}
		</option>
	{/each}
</select>
