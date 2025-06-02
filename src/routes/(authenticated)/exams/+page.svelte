<script lang="ts">
	import { zoom } from '$lib/components/actions/zoom';
	import { formatCapital } from '$lib/shared/utils';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { fade } from 'svelte/transition';
	import {
		CircleCheck,
		CircleChevronsUp,
		CircleMinus,
		Trash,
		Edit,
		FileSearch,
		FilePlus
	} from '@steeze-ui/tabler-icons';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Link from '$lib/components/Link.svelte';
	import Select from '$lib/components/Select.svelte';
	import LabelValue from '$lib/components/LabelValue.svelte';
	import { formatRelativeDate } from '$lib/client/index.js';
	import ExamStatus from '$lib/components/ExamStatus.svelte';

	let { data } = $props();

	const orderByOptions = [
		{ value: 'patientName', label: 'Nombre del paciente' },
		{ value: 'documentId', label: 'Cédula del paciente' },
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
		{ value: 'asc', label: 'Recientes primero' },
		{ value: 'desc', label: 'Antiguos primero' }
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
</script>

<div in:fade class="flex w-full flex-col gap-y-8">
	<p class="text-center text-3xl">Exámenes</p>

	<!-- <div class="flex w-full justify-evenly"> -->
	<div class="flex w-full flex-col justify-evenly gap-x-2 xl:flex-row">
		<SearchBar
			id="searchExamType"
			bind:inputSearch={textSearch}
			placeholder="Busca un examen por paciente o tipo de examen"
			wrapperClass="w-full mt-5"
			debounceTime={500}
			debounceCallback={() => getExams()}
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
				onchange={getExams}
			/>
		</div>
		<div class="flex w-3/10 flex-col items-start justify-center gap-x-2">
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
				placeholder="Dirección de orden"
				class="!w-fit"
				onchange={getExams}
			/>
		</div>

		<Link
			href="/exams/create"
			title="Crear nuevo exámen"
			class="flex items-center justify-center gap-x-1 text-lg transition-all hover:-translate-y-0.25 hover:shadow-lg"
		>
			<span> Nuevo </span>
			<Icon src={FilePlus} size="24" class="text-white" />
		</Link>
	</div>

	<div class="mt-4 grid grid-cols-2 gap-3">
		{#each data.examsData as exam}
			<a
				href="/exams/{exam.id}"
				title="{exam.examTypeName} - {exam.patientName}"
				class="group hover:border-primary-blue flex flex-col gap-y-2 rounded-sm border bg-white px-4 py-2 transition-all select-none hover:-translate-y-1 hover:border hover:shadow-2xl"
			>
				<div class="inline-flex w-full items-center justify-between">
					<!-- <p class="text-lg font-bold">{exam.examTypeName} - {exam.patientName}</p> -->
					<div>
						<!-- Estado ---- Prioridad -->
						<ExamStatus status={exam.status} priority={exam.priority} minimal={true} />
					</div>
					<Icon
						src={FileSearch}
						size="24"
						class="group-hover:text-primary-blue self-end transition-all group-hover:scale-125"
					/>
				</div>
				<div class="space-y-0.5">
					<LabelValue label="Paciente" value={exam.patientName} />
					<LabelValue label="Cédula" value={exam.patientDocumentId} />
					<LabelValue label="Tipo de exámen" value={exam.examTypeName} />
				</div>

				<LabelValue
					label="Último cambio"
					value={formatRelativeDate(exam.updatedAt)}
					class="text-sm"
					labelClass="font-semibold"
				/>
			</a>
		{/each}
	</div>
</div>
