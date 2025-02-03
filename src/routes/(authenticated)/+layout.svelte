<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import NavBar from '$lib/components/layout/NavBar.svelte';
	import SideBar from '$lib/components/layout/SideBar.svelte';

	// TODO: Use the role to know what links/modules show
	let { children, data } = $props();
</script>

<div class="h-full w-full">
	<NavBar fullName={`${data.user.name} ${data.user.lastName}`} email={data.user.email} />
	<div class="mx-auto mt-8 flex justify-evenly px-40">
		<SideBar />
		<Container class={['mx-0 flex w-2/3 max-w-5xl rounded-xl direct-children:p-8']}>
			{@render children()}
		</Container>
	</div>
</div>
