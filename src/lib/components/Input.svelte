<script lang="ts">
	import { Icon, type IconSource } from '@steeze-ui/svelte-icon';
	import type { ClassValue, FocusEventHandler, FormEventHandler } from 'svelte/elements';
	import { fade } from 'svelte/transition';
	import { v4 as uuidv4 } from 'uuid';

	// Prop type
	type PropType = {
		value: string | number;
		name: string;
		label?: string;
		id?: string;
		placeholder?: string;
		title?: string;
		type?: 'text' | 'password' | 'email' | 'number' | 'date' | 'tel';
		disabled?: boolean | null;
		required?: boolean;
		icon?: IconSource;
		class?: ClassValue;
		wrapperClass?: ClassValue;
		min?: string | number | null;
		max?: string | number | null;
		maxlength?: number | null;
		step?: string | number | null | undefined;
		autoComplete?: boolean;
		onfocus?: FocusEventHandler<HTMLInputElement>;
		error?: string[] | string | undefined;
		oninput?: FormEventHandler<HTMLInputElement> | null;
	};

	// Prop deconstruct
	let {
		value = $bindable(''),
		name,
		label,
		id,
		placeholder,
		title,
		type = 'text',
		disabled = false,
		required = false,
		icon,
		class: enteredClass,
		wrapperClass: wrapperClass,
		min,
		max,
		maxlength,
		step,
		autoComplete = true,
		onfocus,
		error,
		oninput
	}: PropType = $props();

	// Reusable classes
	const inputClass = [
		'arrow-hide bg-secondary-blue/30 focus:ring-dark-blue w-full rounded-3xl border border-gray-200 py-2 pl-10 pr-4 focus:outline-hidden focus:ring-1',
		'disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600',
		enteredClass
	];

	// const iconClass = ['text-primary-blue absolute ml-4 h-5 w-5'];
	const iconClass = [
		'text-primary-blue absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none'
	];

	if (label && !id) {
		id = uuidv4();
	}
</script>

<div
	class={[
		'flex items-center',
		wrapperClass,
		{ 'flex-col items-start gap-y-1': label || (error !== undefined && error.length > 0) }
	]}
>
	{#if label}
		<label class="ml-2 font-semibold" for={id}>{label}</label>
	{/if}

	<div class="relative w-full">
		<input
			{id}
			{onfocus}
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
			{maxlength}
			{step}
			{oninput}
			autocomplete={!autoComplete ? 'new-password' : undefined}
		/>

		{#if icon}
			<Icon src={icon} class={[iconClass, { 'text-gray-400!': disabled }]} {title} />
		{/if}
	</div>

	{#if error !== undefined && error.length > 0}
		<span in:fade class="text-sm text-red-500">{error}</span>
	{/if}
</div>
