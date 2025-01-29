<script lang="ts">
	import type { ClassValue, MouseEventHandler } from 'svelte/elements';

	type PropType = {
		children: any;
		type?: 'submit' | 'reset' | 'button';
		title?: string;
		class?: ClassValue;
		onclick?: MouseEventHandler<HTMLButtonElement>;
	};

	let { children, title: text, class: className, type = 'button', onclick }: PropType = $props();

	let classes = [
		'bg-primary-blue text-white hover:bg-primary-blue/75 px-4 py-1 rounded-3xl',
		className
	];
</script>

<button {type} class={classes} {onclick} title={text}>{@render children()}</button>
