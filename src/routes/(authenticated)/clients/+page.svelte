<script lang="ts">
	import { goto } from '$app/navigation';
	import FilterControls from '$lib/components/FilterControls.svelte';
	import LabelValue from '$lib/components/LabelValue.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { UserPlus, UserSearch } from '@steeze-ui/tabler-icons';
	import { fade } from 'svelte/transition';

	let { data } = $props();

	let nameSearch = $state('');

	function getPatiens() {
		goto(`/clients?search=${nameSearch}`, {
			keepFocus: true
		});
	}
</script>

<div in:fade class="flex w-full flex-col gap-y-8">
	<p class="text-center text-3xl">Pacientes</p>

	<div class="flex w-full justify-evenly">
		<SearchBar
			id="searchExamType"
			bind:inputSearch={nameSearch}
			placeholder="Buscar paciente por nombre o cédula"
			wrapperClass="w-4/5"
			debounceTime={500}
			debounceCallback={() => getPatiens()}
		/>
		<!-- <Link
			href="/exam-types/create"
			title="Crear nuevo exámen"
			class="flex items-center justify-center gap-x-1 text-xl"
		>
			<span> Nuevo </span>
			<Icon src={LibraryPlus} size="24" class="mt-1 text-white" />
		</Link> -->
	</div>

	<div class="mt-4 grid grid-cols-2 gap-3">
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
		{/each}
	</div>

	<!-- Pagination -->
	<FilterControls
		baseUrl="/clients"
		totalItems={data.countTotal}
		pageSize={10}
		bind:queryParams={
			() => {
				return { search: nameSearch };
			},
			(v) => {
				nameSearch = v['search'];
			}
		}
	/>
</div>
