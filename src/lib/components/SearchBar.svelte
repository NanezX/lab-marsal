<script lang="ts">
	import Input from './Input.svelte';
	import { Search } from '@steeze-ui/tabler-icons';
	import type { ClassValue } from 'svelte/elements';

	type PropType = {
		inputSearch: string | number;
		name?: string;
		placeholder: string;
		class?: ClassValue;
		wrapperClass?: ClassValue;
	};

	let {
		inputSearch = $bindable(''),
		name = 'inputSearch',
		placeholder,
		class: enteredClass,
		wrapperClass: wrapperClass
	}: PropType = $props();
</script>

<Input
	bind:value={inputSearch}
	{name}
	{placeholder}
	icon={Search}
	class={enteredClass}
	{wrapperClass}
/>
