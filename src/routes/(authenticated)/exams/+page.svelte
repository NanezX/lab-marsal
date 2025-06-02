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
	///////////////////////////
	let { data } = $props();

	const orderByOptions = [
		{ value: 'patientName', label: 'Nombre' },
		{ value: 'documentId', label: 'Cédula' },
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

	let textSearch = $state(page.url.searchParams.get('search') || '');
	let orderBy = $state(page.url.searchParams.get('orderBy') || orderByOptions[0].value);
	let orderDirection = $state(
		page.url.searchParams.get('orderDirection') || orderDirectionOptions[0].value
	);

	function getExams() {
		goto(`/clients?search=${textSearch}&orderBy=${orderBy}&orderDirection=${orderDirection}`, {
			keepFocus: true
		});
	}

	///////////////////////////

	// // TODO: Recheck the types laters coming from the DB
	// type Exam = {
	// 	id: string;
	// 	type: 'hematologia' | 'tipiaje sanguineo' | 'otros';
	// 	clientName: string;
	// 	clientLastName: string;
	// 	numberId: number;
	// 	createdAt: string;
	// 	priority: 'urgente' | 'normal';
	// 	pending: boolean;
	// };

	// const lastExams: any[] = [
	// 	{
	// 		id: '1',
	// 		type: 'hematologia',
	// 		clientName: 'Yacsuri',
	// 		clientLastName: 'Rios',
	// 		numberId: 26837222,
	// 		createdAt: 'Hace 2 horas',
	// 		priority: 'urgente',
	// 		pending: false
	// 	},
	// 	{
	// 		id: '2',
	// 		type: 'hematologia',
	// 		clientName: 'Victor',
	// 		clientLastName: 'Hernandez',
	// 		numberId: 27783554,
	// 		createdAt: 'Hace 3 dias',
	// 		priority: 'normal',
	// 		pending: true
	// 	},
	// 	{
	// 		id: '3',
	// 		type: 'otros',
	// 		clientName: 'Juan',
	// 		clientLastName: 'Perez',
	// 		numberId: 13983282,
	// 		createdAt: 'Hace 5 dias',
	// 		priority: 'normal',
	// 		pending: false
	// 	},
	// 	{
	// 		id: '4',
	// 		type: 'hematologia',
	// 		clientName: 'Juan',
	// 		clientLastName: 'Perez',
	// 		numberId: 13983282,
	// 		createdAt: 'Hace 5 dias',
	// 		priority: 'urgente',
	// 		pending: true
	// 	},
	// 	{
	// 		id: '5',
	// 		type: 'otros',
	// 		clientName: 'Juan',
	// 		clientLastName: 'Perez',
	// 		numberId: 13983282,
	// 		createdAt: 'Hace 5 dias',
	// 		priority: 'normal',
	// 		pending: false
	// 	},
	// 	{
	// 		id: '6',
	// 		type: 'hematologia',
	// 		clientName: 'Juan',
	// 		clientLastName: 'Perez',
	// 		numberId: 13983282,
	// 		createdAt: 'Hace 5 dias',
	// 		priority: 'urgente',
	// 		pending: true
	// 	},
	// 	{
	// 		id: '7',
	// 		type: 'hematologia',
	// 		clientName: 'Juan',
	// 		clientLastName: 'Perez',
	// 		numberId: 13983282,
	// 		createdAt: 'Hace 5 dias',
	// 		priority: 'urgente',
	// 		pending: true
	// 	}
	// ];
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
						<ExamStatus status={exam.status} priority={exam.priority}  minimal={true}/>
					</div>
					<Icon
						src={FileSearch}
						size="24"
						class="group-hover:text-primary-blue self-end transition-all group-hover:scale-125"
					/>
				</div>
				<div class="space-y-0.5">
					<!-- class="text-sm" valueClass="text-gray-800" -->
					<LabelValue label="Tipo de exámen" value={exam.examTypeName} />
					<LabelValue label="Paciente" value={exam.patientName} />
					<LabelValue label="Cédula" value={exam.patientDocumentId} />
				</div>

				<div class="w-ful xl:inline-flex xl:justify-between">
					<!-- <LabelValue
						labelClass="font-semibold"
						label="Cantidad"
						value={examType.examCount}
						class="text-sm"
					/> -->

					<LabelValue
						label="Último cambio"
						value={formatRelativeDate(exam.updatedAt)}
						class="text-sm"
						labelClass="font-semibold"
					/>
				</div>
			</a>

			<!-- <div
				class="hover:border-primary-blue rounded-sm border bg-white px-4 py-2 text-lg select-none hover:border hover:shadow-2xl"
				use:zoom={{ scale: 1.06, zindexIn: '99999', zindexOut: 'auto' }}
			>
				<div class="mb-[-0.25rem] flex">
					<p>
						<span class="font-semibold">Estado: </span>
						<span>{exam.pending ? 'En proceso' : 'Completado'}</span>
					</p>
					<p class="bg-secondary-gray/50 ml-auto w-fit rounded-full p-1"># {exam.id}</p>
				</div>

				<p class="inline-flex items-center gap-x-2">
					<span class="font-semibold">Prioridad: </span>
					{#if exam.pending}
						<span>
							<Icon
								src={exam.priority == 'urgente' ? CircleChevronsUp : CircleMinus}
								size="22"
								class={{
									'text-red-400': exam.priority == 'urgente'
								}}
							/>
						</span>
					{:else}
						<Icon src={CircleCheck} size="22" class="text-green-400" />
					{/if}
				</p>

				<p>
					<span class="font-semibold"> Paciente: </span>
					<span>
						{exam.clientName}
						{exam.clientLastName}
					</span>
				</p>
				<p>
					<span class="font-semibold"> Cedula: </span>
					<span>
						{exam.numberId ?? 'N/A'}
					</span>
				</p>
				<p>
					<span class="font-semibold">Tipo de examen: </span>
					<span>{formatCapital(exam.type)}</span>
				</p>

				<div class="mt-4 flex justify-between">
					<p class="text-end text-sm">Creada: {exam.createdAt}</p>
					<div class="flex gap-x-2">
						<button
							use:zoom={{ scale: 1.25, time: 0.25 }}
							title="Ver"
							class="text-blue-400 hover:text-blue-600"
							onclick={() => alert('ver')}
						>
							<Icon src={FileSearch} size="28" />
						</button>
						{#if exam.pending}
							<button
								use:zoom={{ scale: 1.25, time: 0.25 }}
								title="Editar"
								class="hover text-green-400"
								onclick={() => alert('editar')}
							>
								<Icon src={Edit} size="28" />
							</button>
							<button
								use:zoom={{ scale: 1.25, time: 0.25 }}
								title="Eliminar"
								class="text-red-500"
								onclick={() => alert('eliminar')}
							>
								<Icon src={Trash} size="28" />
							</button>
						{/if}
					</div>
				</div>
			</div> -->
		{/each}
	</div>
</div>
