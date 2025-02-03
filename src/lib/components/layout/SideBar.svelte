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
			text: 'Examanes'
		},
		{
			href: '/clients',
			icon: UsersGroup,
			text: 'Clientes'
		},
		{
			href: '/exam-types',
			icon: Certificate,
			text: 'Tipos examenes'
		},
		{
			href: '/users',
			icon: UserEdit,
			text: 'Gestion de usuarios'
		},
		{
			href: '/config',
			icon: Settings,
			text: 'Configuracion'
		}
	];
</script>

<div class="flex h-fit flex-col rounded-xl border bg-gray-100 p-1 text-xl shadow-2xl">
	<!-- Links / Modulos-->
	{#each routes as route}
		<a
			href={route.href}
			class="flex items-center gap-x-5 rounded px-8 py-4 hover:bg-secondary-blue"
		>
			<Icon src={route.icon} size={route.size || '24'} />
			<span>{route.text}</span>
		</a>
	{/each}
</div>
