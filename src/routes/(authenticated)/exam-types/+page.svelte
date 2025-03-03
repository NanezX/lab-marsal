<script lang="ts">
	import Link from '$lib/components/Link.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { LibraryPlus } from '@steeze-ui/tabler-icons';
	import { fade } from 'svelte/transition';

	let inputSearch = $state('');
</script>

<div in:fade class="flex w-full flex-col gap-y-8">
	<p class="text-center text-3xl">Tipos de exámenes</p>

	<div class="flex w-full justify-evenly">
		<SearchBar bind:inputSearch placeholder="Buscar tipo exámen por nombre" wrapperClass="w-4/5" />
		<Link
			href="/exam-types/create"
			title="Crear nuevo exámen"
			class="flex items-center justify-center gap-x-1 text-xl"
		>
			<span> Nuevo </span>
			<Icon src={LibraryPlus} size="24" class="mt-1 text-white" />
		</Link>
	</div>

	<div class="mt-4 grid grid-cols-2 gap-3">
		<p>Lista de tipos de exámenes</p>
	</div>
</div>
