<script>
	import Container from '$lib/components/Container.svelte';

	let { children } = $props();
</script>

<Container class={['flex', 'direct-children:p-8', 'rounded-xl', 'w-2/3', 'max-w-5xl']}>
	{@render children()}
</Container>
