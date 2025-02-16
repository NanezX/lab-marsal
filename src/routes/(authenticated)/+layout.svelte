<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import NavBar from '$lib/components/layout/NavBar.svelte';
	import SideBar from '$lib/components/layout/SideBar.svelte';

	let { children, data } = $props();
</script>

<div class="h-full w-full">
	<NavBar fullName={`${data.user.firstName} ${data.user.lastName}`} email={data.user.email} />
	<div class="mx-auto mt-10 flex justify-evenly px-40">
		<SideBar />
		<Container class="direct-children:p-8 mx-0 mb-8 flex w-2/3 max-w-5xl rounded-xl bg-white">
			{@render children()}
		</Container>
	</div>
</div>
