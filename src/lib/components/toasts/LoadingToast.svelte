<script lang="ts">
	import Spinner from '../Spinner.svelte';

	// Prop type
	type PropType = {
		text: string;
	};

	let { text }: PropType = $props();
</script>

<div class="flex items-center gap-x-4 p-2 text-lg text-black">
	<Spinner class="max-h-6 min-h-6 min-w-6 max-w-6" />
	<span class="break-all">{text}</span>
</div>
