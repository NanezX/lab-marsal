<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import FilterControls from '$lib/components/FilterControls.svelte';
	import Link from '$lib/components/Link.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import Select from '$lib/components/Select.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { UserPlus } from '@steeze-ui/tabler-icons';
	import { fade } from 'svelte/transition';

	let { data } = $props();

	const orderByOptions = [
		{ value: 'fullName', label: 'Nombre' },
		{ value: 'documentId', label: 'CI del usuario' },
		{ value: 'email', label: 'Correo (@)' }
	];

	let textSearch = $state(page.url.searchParams.get('search') || '');
	let orderBy = $state(page.url.searchParams.get('orderBy') || orderByOptions[0].value);

	function getUsers() {
		goto(`/users?search=${textSearch}&orderBy=${orderBy}`, {
			keepFocus: true
		});
	}
</script>

<div in:fade class="flex w-full flex-col gap-y-8">
	<p class="text-center text-3xl">Gestión de usuarios</p>

	<div class="flex w-full flex-col justify-evenly gap-x-2 xl:flex-row">
		<SearchBar
			id="searchExamType"
			bind:inputSearch={textSearch}
			placeholder="Buscar por nombre o cédula"
			wrapperClass="w-full min-w-1/10 mt-5"
			debounceTime={500}
			debounceCallback={() => {}}
		/>

		<div class="flex w-fit flex-col items-start justify-center gap-x-2">
			<p id="orderBy" class="w-fit text-sm font-semibold">Ordenar por:</p>
			<Select
				id="orderBy"
				bind:value={orderBy}
				items={orderByOptions}
				name="orderBy"
				required
				placeholder="Ordenar por"
				class="!w-fit"
				onchange={getUsers}
			/>
		</div>

		<Link
			href="/register"
			title="Nuevo usuario"
			class="mt-5 flex items-center justify-center gap-x-1 transition-all hover:-translate-y-0.25 hover:shadow-lg"
		>
			<span> Nuevo </span>
			<Icon src={UserPlus} size="24" class=" text-white" />
		</Link>
	</div>

	<div class="flex flex-col gap-y-4">
		<!-- Pagination -->
		<FilterControls
			baseUrl="/users"
			totalItems={data.countTotal}
			pageSize={12}
			bind:queryParams={
				() => {
					return { search: textSearch, orderBy };
				},
				(v) => {
					textSearch = v['search'];
					orderBy = v['orderBy'];
				}
			}
		/>

		<div class="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-3">
			<!--  -->
			<p class="text-center">CONTENT</p>
			<!--  -->
		</div>

		<!-- Pagination -->
		<FilterControls
			baseUrl="/users"
			totalItems={data.countTotal}
			pageSize={12}
			bind:queryParams={
				() => {
					return { search: textSearch, orderBy };
				},
				(v) => {
					textSearch = v['search'];
					orderBy = v['orderBy'];
				}
			}
		/>
	</div>
</div>
