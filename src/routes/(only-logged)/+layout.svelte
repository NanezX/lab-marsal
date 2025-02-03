<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import NavBar from '$lib/components/navs/NavBar.svelte';

	let { children, data } = $props();
</script>

<div class="h-full w-full">
	<NavBar fullName={`${data.user.name} ${data.user.lastName}`} email={data.user.email} />
	<div class="flex">
		<div class="ml-10 mt-8 flex flex-col rounded-xl p-4 direct-children:p-2">
			<!-- Links / Modulos-->
			<a href="/home">Inicio</a>
			<a href="/users">Examenes</a>
			<a href="/users">Clientes</a>
			<a href="/users">Tipos examenes</a>
			<a href="/users">Gestion de usuarios</a>
			<a href="/users">Configuracion</a>
		</div>
		<Container class={['mt-8 flex w-2/3 max-w-5xl rounded-xl direct-children:p-8']}>
			{@render children()}
		</Container>
	</div>
</div>
