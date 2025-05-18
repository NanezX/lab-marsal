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
	class={[
		'bg-primary-blue hover:bg-primary-blue/75 cursor-pointer rounded-3xl px-4 py-2 text-white',
		'disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600',
		className
	]}
	{disabled}
	{type}
	{onclick}
	title={text}
>
	{@render children()}
</button>
