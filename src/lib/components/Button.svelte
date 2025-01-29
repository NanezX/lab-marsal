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

	let classes = [
		'bg-primary-blue text-white hover:bg-primary-blue/75 px-4 py-1 rounded-3xl',
		className,
		{ 'disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600': disabled }
	];
</script>

<button {disabled} {type} class={classes} {onclick} title={text}>{@render children()}</button>
