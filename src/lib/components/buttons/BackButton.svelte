<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import type { ClassValue } from 'svelte/elements';
	import { ArrowLeft } from '@steeze-ui/tabler-icons';
	import Link from '../Link.svelte';

	type PropType = {
		href: string;
		size?: string;
		theme?: 'filled';
		title?: string;
		class?: ClassValue;
		wrapperClass?: ClassValue;
	};

	let {
		href,
		size = '32',
		theme,
		title = 'Ir atrás',
		class: className,
		wrapperClass
	}: PropType = $props();
</script>

<Link
	{href}
	{title}
	class={['!text-primary-blue !rounded-full !bg-inherit !p-0 hover:!text-blue-400', wrapperClass]}
>
	<Icon src={ArrowLeft} {size} {theme} class={['', className]} />
</Link>
