<script lang="ts">
	import Link from '$lib/components/Link.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { LibraryPlus } from '@steeze-ui/tabler-icons';
	import { fade } from 'svelte/transition';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import FilterControls from '$lib/components/FilterControls.svelte';

	let { data } = $props();

	let nameSearch = $state('');

	let pageSize = $state(5);

	let totalItems = $derived(data.countTotal);
	let totalPages = $derived(Math.ceil(totalItems / pageSize));

	let currentPage = $derived(Number(page.url.searchParams.get('skip') || 0) / pageSize);

	function getExamTypes(limit: number = 10, skip: number = 0) {
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
			debounceCallback={() => getExamTypes(pageSize, pageSize * currentPage)}
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

	<div class="mt-4 flex flex-col gap-y-2">
		{#each data.examTypesData as examType, index}
			<p>
				{pageSize * currentPage + index + 1}.
				<strong>{examType.name}</strong>
			</p>
		{/each}
	</div>

	<!-- Pagination -->
	<FilterControls
		baseUrl="/exam-types"
		{pageSize}
		bind:currentPage={() => currentPage, (v) => (currentPage = v)}
		bind:totalPages={() => totalPages, (v) => (totalPages = v)}
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
