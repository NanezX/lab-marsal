<script lang="ts">
	import {
		Microscope,
		Settings,
		Home,
		Certificate,
		UsersGroup,
		UserEdit
	} from '@steeze-ui/tabler-icons';
	import { Icon } from '@steeze-ui/svelte-icon';
</script>

<div
	class={[
		'flex flex-col rounded-xl border bg-gray-100 px-8 py-4 text-xl shadow-2xl',
		'direct-children:flex direct-children:items-center direct-children:gap-x-5 direct-children:p-2',
		'direct-children:rounded hover:direct-children:bg-secondary-blue'
	]}
>
	<!-- Links / Modulos-->
	<a href="/home">
		<Icon src={Home} size="24" />
		<span> Inicio </span>
	</a>
	<a href="/exams">
		<Icon src={Microscope} size="24" />
		<span> Examenes </span>
	</a>
	<a href="/clients">
		<Icon src={UsersGroup} size="24" />
		<span>Clientes</span>
	</a>
	<a href="/exam-types">
		<Icon src={Certificate} size="24" />
		<span> Tipos examenes </span>
	</a>
	<a href="/users">
		<Icon src={UserEdit} size="24" />
		<span> Gestion de usuarios </span>
	</a>
	<a href="/config">
		<Icon src={Settings} size="24" />
		<span> Configuracion </span>
	</a>
</div>
