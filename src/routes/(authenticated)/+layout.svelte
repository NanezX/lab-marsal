<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import ScientificNotations from '$lib/components/helpers/ScientificNotations.svelte';
	import NavBar from '$lib/components/layout/NavBar.svelte';
	import SideBar from '$lib/components/layout/SideBar.svelte';
	import { page } from '$app/state';

	let { children, data } = $props();
</script>

<div class="h-full w-full">
	<NavBar
		fullName={`${data.user.firstName} ${data.user.lastName}`}
		email={data.user.email}
		firstName={data.user.firstName}
		lastName={data.user.lastName}
		role={data.user.role}
	/>
	<div class="mx-auto mt-10 flex justify-evenly px-40">
		<div class="space-y-10">
			<SideBar />

			{#if page.url.pathname == '/exam-types/create'}
				<ScientificNotations class="h-fit w-fit bg-white" />
			{/if}
		</div>

		<Container class="direct-children:p-8 mx-0 mb-8 flex w-2/3 max-w-5xl rounded-xl bg-white">
			{@render children()}
		</Container>
	</div>
</div>
