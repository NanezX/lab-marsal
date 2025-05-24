<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import FilterControls from '$lib/components/FilterControls.svelte';
	import LabelValue from '$lib/components/LabelValue.svelte';
	import Link from '$lib/components/Link.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import Select from '$lib/components/Select.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { UserPlus, UserSearch } from '@steeze-ui/tabler-icons';
	import { fade } from 'svelte/transition';

	let { data } = $props();

	const orderByOptions = [
		{ value: 'name', label: 'Nombre' },
		{ value: 'documentId', label: 'Cédula' }
	];
	const orderDirectionOptions = [
		{ value: 'asc', label: 'Ascendente' },
		{ value: 'desc', label: 'Descendente' }
	];

	const orderDirectionName = [
		{ value: 'asc', label: 'A-Z' },
		{ value: 'desc', label: 'Z-A' }
	];

	let nameSearch = $state(page.url.searchParams.get('search') || '');
	let orderBy = $state(page.url.searchParams.get('orderBy') || orderByOptions[0].value);
	let orderDirection = $state(
		page.url.searchParams.get('orderDirection') || orderDirectionOptions[0].value
	);

	function getPatiens() {
		goto(`/clients?search=${nameSearch}&orderBy=${orderBy}&orderDirection=${orderDirection}`, {
			keepFocus: true
		});
	}
</script>

<div in:fade class="flex w-full flex-col gap-y-8">
	<p class="text-center text-3xl">Pacientes</p>

	<div class="flex w-full flex-col justify-evenly gap-x-2 xl:flex-row">
		<SearchBar
			id="searchExamType"
			bind:inputSearch={nameSearch}
			placeholder="Buscar por nombre o cédula"
			wrapperClass="w-full mt-5"
			debounceTime={500}
			debounceCallback={() => getPatiens()}
		/>
		<div class="flex w-3/10 flex-col items-start justify-center gap-x-2">
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
		</div>
		<Link
			href="/clients/create"
			title="Nuevo paciente"
			class="text- mt-5 flex items-center justify-center gap-x-1 transition-all hover:-translate-y-0.25 hover:shadow-lg"
		>
			<span> Nuevo </span>
			<Icon src={UserPlus} size="24" class=" text-white" />
		</Link>
	</div>

	<div class="flex flex-col gap-y-4">
		<!-- Pagination -->
		<FilterControls
			baseUrl="/clients"
			totalItems={data.countTotal}
			pageSize={12}
			bind:queryParams={
				() => {
					return { search: nameSearch, orderBy, orderDirection };
				},
				(v) => {
					nameSearch = v['search'];
					orderBy = v['orderBy'];
					orderDirection = v['orderDirection'];
				}
			}
		/>

		<div class="mt4 grid grid-cols-2 gap-3 xl:grid-cols-3">
			{#each data.patientsData as patient}
				<a
					title="{patient.firstName} {patient.lastName}"
					href="/clients/{patient.id}"
					class="group hover:border-primary-blue flex flex-col gap-y-2 rounded-sm border bg-white px-4 py-2 transition-all select-none hover:-translate-y-1 hover:border hover:shadow-2xl"
				>
					<div class="inline-flex w-full items-center justify-between">
						<p class="text-lg font-bold">{patient.firstName} {patient.lastName}</p>
						<Icon
							src={UserSearch}
							size="24"
							class="group-hover:text-primary-blue transition-all group-hover:scale-125"
						/>
					</div>

					<LabelValue label="CI" value={patient.documentId} />

					<LabelValue label="Cantidad" value={patient.examCount} class="text-sm" />
				</a>
			{:else}
				<div class="col-span-2 xl:col-span-3">
					<p class="text-center text-lg font-semibold text-gray-500">
						No se encontraron resultados
					</p>
				</div>
			{/each}
		</div>

		<!-- Pagination -->
		<FilterControls
			baseUrl="/clients"
			totalItems={data.countTotal}
			pageSize={12}
			bind:queryParams={
				() => {
					return { search: nameSearch, orderBy, orderDirection };
				},
				(v) => {
					nameSearch = v['search'];
					orderBy = v['orderBy'];
					orderDirection = v['orderDirection'];
				}
			}
		/>
	</div>
</div>
