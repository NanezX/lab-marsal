<script lang="ts">
	import Link from '$lib/components/Link.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { FileSearch, LibraryPlus } from '@steeze-ui/tabler-icons';
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import FilterControls from '$lib/components/FilterControls.svelte';
	import LabelValue from '$lib/components/LabelValue.svelte';
	import { formatRelativeDate, stringMaxLength } from '$lib/client';
	import { page } from '$app/state';

	let { data } = $props();

	let nameSearch = $state(page.url.searchParams.get('name') || '');

	function getExamTypes() {
		goto(`/exam-types?name=${nameSearch}`, {
			keepFocus: true
		});
	}
</script>

<div in:fade class="flex w-full flex-col gap-y-8">
	<p class="text-center text-3xl">Tipos de exámenes</p>

	<div class="flex w-full justify-evenly">
		<SearchBar
			id="searchExamType"
			bind:inputSearch={nameSearch}
			placeholder="Buscar tipo exámen por nombre"
			wrapperClass="w-4/5"
			debounceTime={500}
			debounceCallback={() => getExamTypes()}
		/>
		<Link
			href="/exam-types/create"
			title="Crear nuevo exámen"
			class="flex items-center justify-center gap-x-1 text-xl"
		>
			<span> Nuevo </span>
			<Icon src={LibraryPlus} size="24" class="mt-1 text-white" />
		</Link>
	</div>

	<div class="flex flex-col gap-y-4">
		<!-- Pagination -->
		<FilterControls
			baseUrl="/exam-types"
			totalItems={data.countTotal}
			bind:queryParams={
				() => {
					return { name: nameSearch };
				},
				(v) => {
					nameSearch = v['name'];
				}
			}
		/>

		<div class="grid grid-cols-2 gap-3">
			{#each data.examTypesData as examType}
				<a
					title={examType.name}
					href="/exam-type/{examType.id}"
					class="group hover:border-primary-blue flex flex-col gap-y-2 rounded-sm border bg-white px-4 py-2 transition-all select-none hover:-translate-y-1 hover:border hover:shadow-2xl"
				>
					<div class="inline-flex w-full items-center justify-between">
						<p class="text-lg font-bold">{examType.name}</p>
						<Icon
							src={FileSearch}
							size="24"
							class="group-hover:text-primary-blue transition-all group-hover:scale-125"
						/>
					</div>

					<LabelValue labelClass="font-semibold" label="Ref." value={`${examType.basePrice}$`} />

					<p class="bg-gray-100/80 p-2 break-all text-gray-800">
						{examType.description ? stringMaxLength(examType.description, 50) : 'Sin descripción'}
					</p>

					<div class="w-ful xl:inline-flex xl:justify-between">
						<LabelValue
							labelClass="font-semibold"
							label="Cantidad"
							value={examType.examCount}
							class="text-sm"
						/>

						<LabelValue
							label="Último cambio"
							value={formatRelativeDate(examType.updatedAt)}
							class="text-sm"
							labelClass="font-semibold"
						/>
					</div>
				</a>
			{:else}
				<div class="col-span-2">
					<p class="text-center text-lg font-semibold text-gray-500">
						No se encontraron resultados
					</p>
				</div>
			{/each}
		</div>

		<!-- Pagination -->
		<FilterControls
			baseUrl="/exam-types"
			totalItems={data.countTotal}
			bind:queryParams={
				() => {
					return { name: nameSearch };
				},
				(v) => {
					nameSearch = v['name'];
				}
			}
		/>
	</div>
</div>
