<script lang="ts">
	import { page } from '$app/state';
	import Link from '$lib/components/Link.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import Select from '$lib/components/Select.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { UserPlus } from '@steeze-ui/tabler-icons';
	import { fade } from 'svelte/transition';

	let { data } = $props();


	let nameSearch = $state(page.url.searchParams.get('search') || '');

</script>

<div in:fade class="flex w-full flex-col gap-y-8">
	<p class="text-center text-3xl">Gestión de usuarios</p>

	<div class="flex w-full flex-col justify-evenly gap-x-2 xl:flex-row">
		<SearchBar
			id="searchExamType"
			bind:inputSearch={nameSearch}
			placeholder="Buscar por nombre o cédula"
			wrapperClass="w-full mt-5"
			debounceTime={500}
			debounceCallback={() => {}}
		/>
		<!-- <div class="flex w-3/10 flex-col items-start justify-center gap-x-2">
			<p id="orderBy" class="w-fit text-sm font-semibold">Ordenar por:</p>
			<Select
				id="orderBy"
				bind:value={orderBy}
				items={orderByOptions}
				name="orderBy"
				required
				placeholder="Ordenar por"
				class="!w-fit"
				onchange={getPatiens}
			/>
		</div>
		<div class="flex w-3/10 flex-col items-start justify-center gap-x-2">
			<p id="orderDirection" class="w-fit text-sm font-semibold">Dirección:</p>
			<Select
				id="orderDirection"
				bind:value={orderDirection}
				items={orderBy == 'documentId' ? orderDirectionOptions : orderDirectionName}
				name="orderDirection"
				required
				placeholder="Dirección de orden"
				class="!w-fit"
				onchange={getPatiens}
			/>
		</div> -->
		<Link
			href="/register"
			title="Nuevo usuario"
			class="mt-5 flex items-center justify-center gap-x-1 transition-all hover:-translate-y-0.25 hover:shadow-lg"
		>
			<span> Nuevo </span>
			<Icon src={UserPlus} size="24" class=" text-white" />
		</Link>
	</div>
</div>
