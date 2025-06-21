<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';
	import Button from './Button.svelte';

	type PropType = {
		children: Snippet;
		href: string;
		target?: string;
		title?: string;
		class?: ClassValue;
		linkClass?: ClassValue;
		disabled?: boolean;
	};

	let { children, href, target, title, class: className, linkClass, disabled }: PropType = $props();
</script>

<a {title} {href} class={linkClass} {target}>
	<Button
		{disabled}
		class={[
			'bg-primary-blue hover:bg-primary-blue/75 cursor-pointer rounded-3xl px-4 py-2 text-white',
			'disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600',
			className
		]}
	>
		{@render children()}
	</Button>
</a>
