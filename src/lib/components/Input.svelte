<script lang="ts">
	import { Icon, type IconSource } from '@steeze-ui/svelte-icon';

	// Prop type
	type PropType = {
		value: string;
		placeholder?: string;
		title?: string;
		type?: 'text' | 'password' | 'email';
		disabled?: boolean;
		icon?: IconSource;
	};

	// Prop deconstruct
	let {
		value = $bindable(''),
		placeholder,
		title,
		type = 'text',
		disabled = false,
		icon
	}: PropType = $props();

	// Reusable classes
	const inputClass = [
		'bg-secondary-blue/30 focus:ring-dark-blue w-full rounded-3xl border py-2 pl-10 pr-4 focus:outline-none focus:ring-1',
		{ 'disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600': disabled }
	];
	const iconClass = ['text-primary-blue absolute ml-4 h-5 w-5', { 'text-gray-400': disabled }];
</script>

{#if icon}
	<div class="relative flex items-center">
		<input bind:value {type} {placeholder} {disabled} {title} class={inputClass} />

		<Icon src={icon} class={iconClass} {title} />
	</div>
{:else}
	<!-- else content here -->
	<p>Input without icon</p>
{/if}
