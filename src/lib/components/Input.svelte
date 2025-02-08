<script lang="ts">
	import { Icon, type IconSource } from '@steeze-ui/svelte-icon';
	import type { ClassValue } from 'svelte/elements';

	// Prop type
	type PropType = {
		value: string;
		name: string;
		placeholder?: string;
		title?: string;
		type?: 'text' | 'password' | 'email' | 'number' | 'date';
		disabled?: boolean | null;
		required?: boolean;
		icon?: IconSource;
		wrapperClass?: ClassValue;
		min?: string | number | null;
		max?: string | number | null;
	};

	// Prop deconstruct
	let {
		value = $bindable(''),
		name,
		placeholder,
		title,
		type = 'text',
		disabled = false,
		required = false,
		icon,
		wrapperClass: wrapperClass,
		min,
		max
	}: PropType = $props();

	// Reusable classes
	const inputClass = [
		'arrow-hide bg-secondary-blue/30 focus:ring-dark-blue w-full rounded-3xl border border-gray-200 py-2 pl-10 pr-4 focus:outline-hidden focus:ring-1',
		'disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600'
	];

	const iconClass = ['text-primary-blue absolute ml-4 h-5 w-5'];
</script>

<div class={['flex items-center', wrapperClass]}>
	<input
		bind:value
		{name}
		{type}
		{placeholder}
		{disabled}
		{title}
		class={[inputClass, { '!pl-4': icon == undefined }]}
		{required}
		{min}
		{max}
	/>

	{#if icon}
		<Icon src={icon} class={[iconClass, { 'text-gray-400!': disabled }]} {title} />
	{/if}
</div>
