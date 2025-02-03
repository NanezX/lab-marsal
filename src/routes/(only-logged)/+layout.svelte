<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import NavBar from '$lib/components/navs/NavBar.svelte';
	import { ChevronDown, UserCircle, Logout } from '@steeze-ui/tabler-icons';
	import { Icon } from '@steeze-ui/svelte-icon';

	let { children, data } = $props();
</script>

<div class="h-full w-full">
	<NavBar fullName={`${data.user.name} ${data.user.lastName}`} email={data.user.email} />
	<div class="flex">
		<div
			class={[
				'ml-10 mt-8 flex flex-col rounded-xl border bg-gray-200 p-4 text-xl shadow-2xl',
				'direct-children:flex direct-children:items-center direct-children:gap-x-3 direct-children:p-2'
			]}
		>
			<!-- Links / Modulos-->
			<a href="/home">
				<Icon src={UserCircle} size="24" />
				<span> Inicio </span>
			</a>
			<a href="/exams">
				<Icon src={UserCircle} size="24" />
				<span> Examenes </span>
			</a>
			<a href="/clients">
				<Icon src={UserCircle} size="24" />
				<span>Clientes</span>
			</a>
			<a href="/exam-types">
				<Icon src={UserCircle} size="24" />
				<span> Tipos examenes </span>
			</a>
			<a href="/users">
				<Icon src={UserCircle} size="24" />
				<span> Gestion de usuarios </span>
			</a>
			<a href="/config">
				<Icon src={UserCircle} size="24" />
				<span> Configuracion </span>
			</a>
		</div>
		<Container class={['mt-8 flex w-2/3 max-w-5xl rounded-xl direct-children:p-8']}>
			{@render children()}
		</Container>
	</div>
</div>
