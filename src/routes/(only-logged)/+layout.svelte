<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import NavBar from '$lib/components/navs/NavBar.svelte';

	let { children, data } = $props();
</script>

<NavBar fullName={`${data.user.name} ${data.user.lastName}`} email={data.user.email} />
<Container class={['flex', 'direct-children:p-8', 'rounded-xl', 'w-2/3', 'max-w-5xl']}>
	{@render children()}
</Container>
