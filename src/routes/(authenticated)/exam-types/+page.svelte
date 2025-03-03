<script lang="ts">
	import Link from '$lib/components/Link.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { LibraryPlus } from '@steeze-ui/tabler-icons';
	import { fade } from 'svelte/transition';
	import { page } from '$app/state';

	let { data } = $props();

	let inputSearch = $state('');

	let pageSize = $state(3);

	let totalItems = $state(data.countTotal);
	let totalPages = $derived(Math.ceil(totalItems / pageSize));

	let currentPage = $derived(Number(page.url.searchParams.get('skip') || 0) / pageSize);
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

	<div class="mt-4 flex flex-col gap-y-2">
		{#each data.examTypesData as examType, index}
			<p>
				{pageSize * currentPage + index + 1}.
				<strong>{examType.name}</strong>
			</p>
		{/each}
	</div>

	<!-- Pagination -->
	<div
		class="direct-children:hover:text-blue-700 direct-children:hover:underline mx-auto w-fit space-x-2 text-lg font-semibold"
	>
		<!-- Back -->
		<a
			href="/exam-types?limit={pageSize}&skip={pageSize * (currentPage - 1)}"
			class={{
				'pointer-events-none opacity-50': currentPage === 0
			}}
		>
			{'<'}
		</a>

		{#each Array(totalPages) as _, index}
			<a
				href="/exam-types?limit={pageSize}&skip={pageSize * index}"
				class={{
					'text-blue-500': index === currentPage
				}}
			>
				{index + 1}
			</a>
		{/each}

		<!-- Next -->
		<a
			href="/exam-types?limit={pageSize}&skip={pageSize * (currentPage + 1)}"
			class={{
				'pointer-events-none opacity-50': totalPages < 1 || currentPage === totalPages - 1
			}}
		>
			{'>'}
		</a>
	</div>

	<p>{data.countTotal}</p>
</div>
