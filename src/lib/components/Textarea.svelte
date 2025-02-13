<script lang="ts">
	import type { ClassValue } from 'svelte/elements';

	// Prop type
	type PropType = {
		value: string | number;
		name: string;
		placeholder?: string;
		disabled?: boolean | null;
		id?: string | null;
		required?: boolean;
		class?: ClassValue;
	};

	let {
		value = $bindable(''),
		name,
		placeholder,
		disabled,
		id,
		required,
		class: className
	}: PropType = $props();

	// Reusable classes
	const mainClass = [
		'mb-0 bg-secondary-blue/30 focus:ring-dark-blue w-full min-w-1/2 min-h-[70px] max-w-full resize rounded-3xl border border-gray-200 py-2 px-4 focus:outline-hidden focus:ring-1',
		'disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600'
	];
</script>

<textarea
	bind:value
	{name}
	{id}
	{placeholder}
	{disabled}
	{required}
	autocomplete="off"
	class={[mainClass, className]}
></textarea>
