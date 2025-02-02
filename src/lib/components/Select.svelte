<script lang="ts" generics="T">
	import { isObject } from '$lib/shared/utils';
	import { Icon, type IconSource } from '@steeze-ui/svelte-icon';
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
		icon?: IconSource;
		wrapperClass?: ClassValue;
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
		icon,
		wrapperClass: wrapperClass,
		key
	}: PropType = $props();

	// Reusable classes
	const inputClass = [
		'bg-secondary-blue/30 focus:ring-dark-blue w-full rounded-3xl border py-2 pl-10 pr-4 focus:outline-none focus:ring-1',
		'disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600'
	];

	const iconClass = ['text-primary-blue absolute ml-4 h-5 w-5'];
</script>

<div class={['relative flex items-center', wrapperClass]}>
	<select bind:value {name} {required}>
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

	{#if icon}
		<Icon src={icon} class={[iconClass, { '!text-gray-400': disabled }]} {title} />
	{/if}
</div>
