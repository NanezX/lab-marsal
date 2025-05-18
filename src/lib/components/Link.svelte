<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';
	import Button from './Button.svelte';

	type PropType = {
		children: Snippet;
		href: string;
		title?: string;
		class?: ClassValue;
	};

	let { children, href, title, class: className }: PropType = $props();
</script>

<a {title} {href}>
	<Button
		class={[
			'bg-primary-blue hover:bg-primary-blue/75 cursor-pointer rounded-3xl px-4 py-2 text-white',
			'disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600',
			className
		]}
	>
		{@render children()}
	</Button>
</a>
