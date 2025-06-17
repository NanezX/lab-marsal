<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import ScientificNotations from '$lib/components/helpers/ScientificNotations.svelte';
	import NavBar from '$lib/components/layout/NavBar.svelte';
	import SideBar from '$lib/components/layout/SideBar.svelte';
	import { page } from '$app/state';

	let { children, data } = $props();
	///
	import { Sidebar, SidebarGroup, SidebarItem, SidebarButton, uiHelpers } from 'flowbite-svelte';
	import {
		HomeOutline,
		MicroscopeOutline,
		UsersGroupOutline,
		BookOpenReaderOutline,
		UserEditOutline,
		AdjustmentsVerticalOutline
	} from 'flowbite-svelte-icons';
	let activeUrl = $state(page.url.pathname);
	const spanClass = 'flex-1 ms-3 whitespace-nowrap';
	const demoSidebarUi = uiHelpers();
	let isDemoOpen = $state(false);
	const closeDemoSidebar = demoSidebarUi.close;
	$effect(() => {
		isDemoOpen = demoSidebarUi.isOpen;
		activeUrl = page.url.pathname;
	});
</script>

<div class="h-full w-full">
	<NavBar fullName={`${data.user.firstName} ${data.user.lastName}`} email={data.user.email} />
	<div class="mx-auto mt-10 flex justify-evenly px-40">
		<SidebarButton onclick={demoSidebarUi.toggle} class="mb-2" />
		<Sidebar
			{activeUrl}
			backdrop={false}
			isOpen={isDemoOpen}
			closeSidebar={closeDemoSidebar}
			params={{ x: -50, duration: 50 }}
			class="top-auto ml-auto h-fit rounded-xl border border-gray-200 bg-gray-100 p-1 text-xl shadow-2xl"
			position="static"
			activeClass="p-2"
			nonActiveClass="p-2"
		>
			<SidebarGroup>
				<SidebarItem label="Inicio" href="/home">
					{#snippet icon()}
						<HomeOutline
							class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
						/>
					{/snippet}
				</SidebarItem>
				<SidebarItem label="Exámenes" href="/exams">
					{#snippet icon()}
						<MicroscopeOutline
							class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
						/>
					{/snippet}
				</SidebarItem>
				<SidebarItem label="Clientes" href="/clients">
					{#snippet icon()}
						<UsersGroupOutline
							class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
						/>
					{/snippet}
				</SidebarItem>
				<SidebarItem label="Tipos exámenes" href="/exam-types">
					{#snippet icon()}
						<BookOpenReaderOutline
							class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
						/>
					{/snippet}
				</SidebarItem>
				<SidebarItem label="Gestión de usuarios" href="/users">
					{#snippet icon()}
						<UserEditOutline
							class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
						/>
					{/snippet}
				</SidebarItem>
				<SidebarItem label="Configuración" href="/config">
					{#snippet icon()}
						<AdjustmentsVerticalOutline
							class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
						/>
					{/snippet}
				</SidebarItem>
			</SidebarGroup>
		</Sidebar>
		<button
			class="cursor-pointer"
			onclick={() => {
				console.log('thisss');
				console.log('thisss2');
				isDemoOpen = !isDemoOpen;
			}}
		>
			xdaver</button
		>

		<Container class="direct-children:p-8 mx-0 mb-8 flex w-2/3 max-w-5xl rounded-xl bg-white">
			{@render children()}
		</Container>
	</div>
</div>
