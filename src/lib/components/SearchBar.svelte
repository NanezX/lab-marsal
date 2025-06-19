<script lang="ts">
	import Input from './Input.svelte';
	import { Search } from '@steeze-ui/tabler-icons';
	import type { ClassValue } from 'svelte/elements';

	type PropType = {
		inputSearch: string | number;
		id?: string;
		name?: string;
		placeholder: string;
		class?: ClassValue;
		wrapperClass?: ClassValue;
		debounceTime?: number;
		debounceCallback?:
			| ((input: string | number) => Promise<void>)
			| ((input: string | number) => void);
	};

	let {
		inputSearch = $bindable(''),
		id,
		name = 'inputSearch',
		placeholder,
		class: enteredClass,
		wrapperClass: wrapperClass,
		debounceTime = 0,
		debounceCallback
	}: PropType = $props();

	let timeout: number;

	function handle_search() {
		if (debounceCallback !== undefined) {
			if (timeout !== undefined) clearTimeout(timeout);

			timeout = window.setTimeout(async () => {
				await debounceCallback(inputSearch);
			}, debounceTime);
		}
	}
</script>

<Input
	{id}
	bind:value={inputSearch}
	{name}
	{placeholder}
	icon={Search}
	class={enteredClass}
	{wrapperClass}
	oninput={debounceCallback === undefined ? null : handle_search}
/>
