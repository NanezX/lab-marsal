<script lang="ts">
	import { X } from '@steeze-ui/tabler-icons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import ToastSkeleton from './ToastSkeleton.svelte';

	// Prop type
	type PropType = {
		text: string;
	};

	let { text }: PropType = $props();
</script>

<ToastSkeleton>
	<span>
		<Icon src={X} class="h-8 w-8 p-0 text-red-500" />
	</span>
	<span class="break-all">{text}</span>
</ToastSkeleton>
