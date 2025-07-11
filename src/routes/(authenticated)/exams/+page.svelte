<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { fade } from 'svelte/transition';
	import { FileSearch, FilePlus } from '@steeze-ui/tabler-icons';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Link from '$lib/components/Link.svelte';
	import Select from '$lib/components/Select.svelte';
	import LabelValue from '$lib/components/LabelValue.svelte';
	import { formatRelativeDate } from '$lib/client/index.js';
	import ExamStatus from '$lib/components/ExamStatus.svelte';
	import FilterControls from '$lib/components/FilterControls.svelte';
	import { ExamPriority } from '$lib/shared/enums.js';
	import { Popover, Button as ButtonFlowbite } from 'flowbite-svelte';

	let { data } = $props();

	const orderByOptions = [
		{ value: 'patientName', label: 'Paciente' },
		{ value: 'documentId', label: 'CI del paciente' },
		{ value: 'examTypeName', label: 'Tipo de exámen' },
		{ value: 'updatedAt', label: 'Último cambio' }
	];
	const orderDirectionOptions = [
		{ value: 'asc', label: 'Ascendente' },
		{ value: 'desc', label: 'Descendente' }
	];

	const orderDirectionName = [
		{ value: 'asc', label: 'A-Z' },
		{ value: 'desc', label: 'Z-A' }
	];

	const orderDirectionTime = [
		{ value: 'asc', label: 'Recientes' },
		{ value: 'desc', label: 'Antiguos' }
	];

	let textSearch = $state(page.url.searchParams.get('search') || '');
	let orderBy = $state(page.url.searchParams.get('orderBy') || orderByOptions[0].value);
	let orderDirection = $state(
		page.url.searchParams.get('orderDirection') || orderDirectionOptions[0].value
	);

	function getExams() {
		goto(`/exams?search=${textSearch}&orderBy=${orderBy}&orderDirection=${orderDirection}`, {
			keepFocus: true
		});
	}

	const priorityLabel = {
		[ExamPriority.High]: 'Alta prioridad',
		[ExamPriority.Normal]: 'Normal',
		[ExamPriority.Low]: 'Baja prioridad'
	};
</script>

<div in:fade class="flex w-full flex-col gap-y-8">
	<p class="text-center text-3xl">Exámenes</p>

	<div class="flex w-full flex-col justify-evenly gap-x-2 xl:flex-row">
		<SearchBar
			id="searchExamType"
			bind:inputSearch={textSearch}
			placeholder="Buscar por examen o paciente (nombre o CI)"
			wrapperClass="w-full min-w-1/10 mt-5"
			debounceTime={500}
			debounceCallback={() => getExams()}
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
				onchange={getExams}
			/>
		</div>
		<div class="flex w-fit flex-col items-start justify-center gap-x-2">
			<p id="orderDirection" class="w-fit text-sm font-semibold">Dirección:</p>
			<Select
				id="orderDirection"
				bind:value={orderDirection}
				items={orderBy == 'documentId'
					? orderDirectionOptions
					: orderBy === 'updatedAt'
						? orderDirectionTime
						: orderDirectionName}
				name="orderDirection"
				required
				placeholder="Dirección"
				class="!w-fit"
				onchange={getExams}
			/>
		</div>

		<Link
			href="/exams/create"
			title="Crear nuevo exámen"
			class="mt-5 flex items-center justify-center gap-x-1 transition-all hover:-translate-y-0.25 hover:shadow-lg"
		>
			<span> Nuevo </span>
			<Icon src={FilePlus} size="24" class="text-white" />
		</Link>
	</div>
	<div class="flex flex-col gap-y-4">
		<!-- Pagination -->
		<FilterControls
			baseUrl="/exams"
			totalItems={data.countTotal}
			pageSize={12}
			bind:queryParams={
				() => {
					return { search: textSearch, orderBy, orderDirection };
				},
				(v) => {
					textSearch = v['search'];
					orderBy = v['orderBy'];
					orderDirection = v['orderDirection'];
				}
			}
		/>

		<div class="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-3">
			{#each data.ordersData as exam, index (exam.id)}
				<a
					href="/exams/{exam.id}"
					title="{exam.examTypeNames} - {exam.patientName}"
					class="group hover:border-primary-blue flex flex-col gap-y-2 rounded-sm border bg-white px-4 py-2 transition-all select-none hover:-translate-y-1 hover:border hover:shadow-2xl"
				>
					<div class="inline-flex w-full items-center justify-between">
						<LabelValue label="Paciente" value={exam.patientName} />

						<Icon
							src={FileSearch}
							size="24"
							class="group-hover:text-primary-blue self-end transition-all group-hover:scale-125"
						/>
					</div>
					<div class="space-y-0.5">
						<LabelValue label="Paciente" value={exam.patientName} />
						<LabelValue label="Cédula" value={exam.patientDocumentId ?? 'N/A'} />
						<LabelValue
							valueClass="capitalize"
							label="Prioridad"
							value={priorityLabel[exam.priority]}
						/>

						<LabelValue
							label="Último cambio"
							value={formatRelativeDate(exam.updatedAt)}
							class="mt-auto text-sm"
							labelClass="font-semibold"
						/>
					</div>
					<ButtonFlowbite
						class="bg-secondary-blue mx-auto justify-self-center font-bold text-black"
						id="hover-{index}"
					>
						Visualizar exámenes
					</ButtonFlowbite>

					<Popover
						class="w-64 text-sm font-light "
						title="Exámenes"
						triggeredBy="#hover-{index}"
						trigger="hover">{exam.examTypeNames}</Popover
					>
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
			baseUrl="/exams"
			totalItems={data.countTotal}
			pageSize={12}
			bind:queryParams={
				() => {
					return { search: textSearch, orderBy, orderDirection };
				},
				(v) => {
					textSearch = v['search'];
					orderBy = v['orderBy'];
					orderDirection = v['orderDirection'];
				}
			}
		/>
	</div>
</div>
