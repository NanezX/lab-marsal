<script lang="ts">
	import {
		Microscope,
		Settings,
		Home,
		Certificate,
		UsersGroup,
		UserEdit
	} from '@steeze-ui/tabler-icons';
	import { Icon, type IconSource } from '@steeze-ui/svelte-icon';
	import type { UserRoles } from '$lib/shared/enums';
	import { page } from '$app/state';

	type Route = {
		href: string;
		icon: IconSource;
		text: string;
		size?: string;
		rolAccess?: UserRoles;
	};

	// TODO: Define rol access for each route
	let routes: Route[] = [
		{
			href: '/home',
			icon: Home,
			text: 'Inicio'
		},
		{
			href: '/exams',
			icon: Microscope,
			text: 'Exámenes'
		},
		{
			href: '/clients',
			icon: UsersGroup,
			text: 'Clientes'
		},
		{
			href: '/exam-types',
			icon: Certificate,
			text: 'Tipos exámenes'
		},
		{
			href: '/users',
			icon: UserEdit,
			text: 'Gestión de usuarios'
		},
		{
			href: '/config',
			icon: Settings,
			text: 'Configuración'
		}
	];
</script>

<div
	class="flex h-fit flex-col rounded-xl border border-gray-200 bg-gray-100 p-1 text-xl shadow-2xl"
>
	<!-- Links / Modulos-->
	{#each routes as route}
		<a
			href={route.href}
			class={[
				'hover:bg-secondary-blue flex items-center gap-x-5 rounded-sm px-8 py-4',
				{ 'bg-gray-200': page.url.pathname == route.href }
			]}
		>
			<Icon src={route.icon} size={route.size || '24'} />
			<span>{route.text}</span>
		</a>
	{/each}
</div>
