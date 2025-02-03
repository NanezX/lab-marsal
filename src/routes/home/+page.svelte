<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import NavBar from '$lib/components/navs/NavBar.svelte';
</script>

<NavBar text="Victor Hernandez" />
<Container
	class={[
		'flex',
		'direct-children:p-8',
		'rounded-xl',
		'w-2/3',
		'max-w-full',
		'bg-white',
		'h-[600px]',
		'items-center justify-center'
	]}
>
	<p>Let's gou</p>
	<p>Let's gou</p>
</Container>
