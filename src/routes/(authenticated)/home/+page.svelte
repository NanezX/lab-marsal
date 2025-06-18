<script lang="ts">
	import { zoom } from '$lib/components/actions/zoom.js';
	import { formatCapital } from '$lib/shared/utils.js';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { fade } from 'svelte/transition';
	import icon from '$lib/assets/logo.webp';
	import {
		UserShare,
		FileSearch,
		CircleChevronsUp,
		CircleMinus,
		CircleCheck,
		UserSearch
	} from '@steeze-ui/tabler-icons';
	import { Img } from 'flowbite-svelte';
	import ExamStatus from '$lib/components/ExamStatus.svelte';
	import LabelValue from '$lib/components/LabelValue.svelte';
	import { formatRelativeDate } from '$lib/client/index.js';

	let { data } = $props();

	// TODO: Recheck the types laters coming from the DB
	type Exam = {
		id: string;
		type: 'hematologia' | 'tipiaje sanguineo' | 'otros';
		clientName: string;
		clientLastName: string;
		createdAt: string;
		priority: 'urgente' | 'normal';
		pending: boolean;
	};
	type Client = {
		id: string;
		name: string;
		lastName: string;
		updatedAt: string;
		pendingExams: number;
	};

	// TODO: Last exams views (max 4 exams). This should come already by latest view
	const lastExams: Exam[] = [
		{
			id: '1',
			type: 'hematologia',
			clientName: 'Yacsuri',
			clientLastName: 'Rios',
			createdAt: 'Hace 2 horas',
			priority: 'urgente',
			pending: false
		},
		{
			id: '2',
			type: 'hematologia',
			clientName: 'Victor',
			clientLastName: 'Hernandez',
			createdAt: 'Hace 3 dias',
			priority: 'normal',
			pending: true
		},
		{
			id: '3',
			type: 'otros',
			clientName: 'Juan',
			clientLastName: 'Perez',
			createdAt: 'Hace 5 dias',
			priority: 'normal',
			pending: false
		},
		{
			id: '4',
			type: 'hematologia',
			clientName: 'Juan',
			clientLastName: 'Perez',
			createdAt: 'Hace 5 dias',
			priority: 'urgente',
			pending: true
		}
	];

	// TODO: Last client views (max 4 clients). This should come already by latest view
	const lastClients: Client[] = [
		{
			id: '1',
			name: 'Victor',
			lastName: 'Hernandez',
			updatedAt: 'Hace 2 horas',
			pendingExams: 1
		},
		{
			id: '2',
			name: 'Yacsuri',
			lastName: 'Rios',
			updatedAt: 'Ayer',
			pendingExams: 0
		},
		{
			id: '3',
			name: 'Juan',
			lastName: 'Perez',
			updatedAt: 'Hace 4 dias',
			pendingExams: 2
		},
		{
			id: '4',
			name: 'Daniela',
			lastName: 'Sanchez',
			updatedAt: 'Hace 1 semana',
			pendingExams: 0
		}
	];
</script>

<div in:fade class="flex w-full flex-col">
	<div class="flex items-center justify-evenly gap-x-20">
		<p class="text-3xl">Bienvenido {data.user.firstName}</p>
		<Img
			src={icon}
			class="max-w-[220px] rounded-2xl border-2 border-gray-200 p-2"
			alt="El logo de MarsalLab"
		/>
	</div>

	<div class="space-y-4">
		<div class="space-y-4 pt-2">
			<p class="text-center text-xl font-bold">Ultimos examenes actualizados</p>

			<div class="mt-4 grid grid-cols-2 gap-3">
				{#each data.lastExamsUpdated as exam}
					<a
						href="/exams/{exam.id}"
						title="{exam.examTypeName} - {exam.patientName}"
						class="group hover:border-primary-blue flex flex-col gap-y-2 rounded-sm border bg-white px-4 py-2 transition-all select-none hover:-translate-y-1 hover:border hover:shadow-2xl"
					>
						<div class="inline-flex w-full items-center justify-between">
							<ExamStatus status={exam.status} priority={exam.priority} minimal />
							<Icon
								src={FileSearch}
								size="24"
								class="group-hover:text-primary-blue self-end transition-all group-hover:scale-125"
							/>
						</div>
						<div class="space-y-0.5">
							<LabelValue label="Paciente" value={exam.patientName} />
							<LabelValue label="Cédula" value={exam.patientDocumentId} />
							<LabelValue label="Exámen" value={exam.examTypeName} />
						</div>

						<LabelValue
							label="Último cambio"
							value={formatRelativeDate(exam.updatedAt)}
							class="mt-auto text-sm"
							labelClass="font-semibold"
						/>
					</a>
				{:else}
					<div class="col-span-2">
						<p class="text-center text-lg font-semibold text-gray-500">
							No se encontraron resultados
						</p>
					</div>
				{/each}
			</div>
		</div>

		<div class="space-y-4 pt-2">
			<p class="text-center text-xl font-bold">Ultimos clientes actualizados</p>

			<div class="grid grid-cols-2 gap-3">
				{#each data.lastPatientsUpdated as patient}
					<a
						title="{patient.firstName} {patient.lastName}"
						href="/clients/{patient.id}"
						class="group hover:border-primary-blue flex flex-col gap-y-2 rounded-sm border bg-white px-4 py-2 transition-all select-none hover:-translate-y-1 hover:border hover:shadow-2xl"
					>
						<div class="inline-flex w-full items-center justify-between">
							<p class="font-bold">{patient.firstName} {patient.lastName}</p>
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
					<div class="col-span-2">
						<p class="text-center text-lg font-semibold text-gray-500">
							No se encontraron resultados
						</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
