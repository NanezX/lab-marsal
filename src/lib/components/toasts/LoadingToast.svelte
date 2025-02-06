<script lang="ts">
	import Spinner from '../Spinner.svelte';
	import ToastSkeleton from './ToastSkeleton.svelte';

	// Prop type
	type PropType = {
		text: string;
	};

	let { text }: PropType = $props();
</script>

<ToastSkeleton>
	<Spinner element="span" class="m-1 max-h-6 min-h-6 max-w-6 min-w-6" />
	<span class="break-all">{text}</span>
</ToastSkeleton>
