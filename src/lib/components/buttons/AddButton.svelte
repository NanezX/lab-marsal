<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { CirclePlus } from '@steeze-ui/tabler-icons';
	import Button from '../Button.svelte';
	import type { MouseEventHandler } from 'svelte/elements';

	type PropType = {
		size?: string;
		theme?: 'filled';
		title?: string;
		onclick?: MouseEventHandler<HTMLButtonElement>;
	};

	let { size = '32', theme, title, onclick }: PropType = $props();
</script>

<Button class="!bg-inherit !p-0" {title} {onclick}>
	<Icon src={CirclePlus} {size} {theme} class="text-primary-blue hover:text-primary-blue/75" />
</Button>
