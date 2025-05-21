<script lang="ts" generics="T">
	import type { ChangeEventHandler, ClassValue } from 'svelte/elements';

	type Option<T> = T | { value: T; label: string };

	type PropType = {
		name: string;
		value: T | null | undefined;
		items: Option<T>[];
		placeholder: string;
		title?: string;
		id?: string;
		disabled?: boolean | null;
		required?: boolean;
		class?: ClassValue;
		forcePlaceholder?: boolean;
		onchange?: ChangeEventHandler<HTMLSelectElement>;
	};

	let {
		name,
		value = $bindable(),
		items,
		placeholder,
		title,
		id,
		disabled = false,
		required = false,
		class: classes,
		forcePlaceholder = false,
		onchange
	}: PropType = $props();

	// If forcePlaceholder is active, unset the value to allow placeholder to appear
	if (forcePlaceholder) {
		value = null;
	}

	const selectClass = [
		'bg-secondary-blue/30 focus:ring-dark-blue w-full rounded-3xl border py-2 px-4 focus:outline-hidden focus:ring-1',
		'disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600',
		classes,
		'border-r-8 border-transparent cursor-pointer'
	];
</script>

<select bind:value {name} {required} class={selectClass} {title} {disabled} {id} {onchange}>
	<option value={null} disabled>{placeholder}</option>

	{#each items as item}
		<!-- Support both raw value and { value, label } object -->
		<option
			value={item !== null && typeof item === 'object' && 'value' in item ? item.value : item}
		>
			{item !== null && typeof item === 'object' && 'label' in item ? item.label : item}
		</option>
	{/each}
</select>
