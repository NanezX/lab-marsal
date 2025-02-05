<script lang="ts">
	import { Check } from '@steeze-ui/tabler-icons';
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
		<Icon src={Check} class="animate-zoomin h-8 w-8 p-0 text-green-500" />
	</span>
	<span class="break-all">{text}</span>
</ToastSkeleton>
