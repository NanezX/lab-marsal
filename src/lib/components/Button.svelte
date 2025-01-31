<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue, MouseEventHandler } from 'svelte/elements';

	type PropType = {
		children: Snippet;
		type?: 'submit' | 'reset' | 'button';
		title?: string;
		class?: ClassValue;
		disabled?: boolean;
		onclick?: MouseEventHandler<HTMLButtonElement>;
	};

	let {
		children,
		title: text,
		class: className,
		type = 'button',
		onclick,
		disabled = false
	}: PropType = $props();
</script>

<button
	{disabled}
	{type}
	class={[
		'rounded-3xl bg-primary-blue px-4 py-1 text-white hover:bg-primary-blue/75',
		'disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600',
		className
	]}
	{onclick}
	title={text}>{@render children()}</button
>
