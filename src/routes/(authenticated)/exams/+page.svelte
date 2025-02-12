<script lang="ts">
	import { zoom } from '$lib/components/actions/zoom';
	import Button from '$lib/components/Button.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Input from '$lib/components/Input.svelte';
	import BaseModal from '$lib/components/modal/BaseModal.svelte';
	import Select from '$lib/components/Select.svelte';
	import { formatCapital } from '$lib/shared/utils';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { fade } from 'svelte/transition';
	import {
		CircleCheck,
		CircleChevronsUp,
		CircleMinus,
		Search,
		Trash,
		Edit,
		FileSearch,
		UserSearch
	} from '@steeze-ui/tabler-icons';
	import SearchBar from '$lib/components/SearchBar.svelte';

	// TODO: Recheck the types laters coming from the DB
	type Exam = {
		id: string;
		type: 'hematologia' | 'tipiaje sanguineo' | 'otros';
		clientName: string;
		clientLastName: string;
		numberId: number;
		createdAt: string;
		priority: 'urgente' | 'normal';
		pending: boolean;
	};

	const lastExams: Exam[] = [
		{
			id: '1',
			type: 'hematologia',
			clientName: 'Yacsuri',
			clientLastName: 'Rios',
			numberId: 26837222,
			createdAt: 'Hace 2 horas',
			priority: 'urgente',
			pending: false
		},
		{
			id: '2',
			type: 'hematologia',
			clientName: 'Victor',
			clientLastName: 'Hernandez',
			numberId: 27783554,
			createdAt: 'Hace 3 dias',
			priority: 'normal',
			pending: true
		},
		{
			id: '3',
			type: 'otros',
			clientName: 'Juan',
			clientLastName: 'Perez',
			numberId: 13983282,
			createdAt: 'Hace 5 dias',
			priority: 'normal',
			pending: false
		},
		{
			id: '4',
			type: 'hematologia',
			clientName: 'Juan',
			clientLastName: 'Perez',
			numberId: 13983282,
			createdAt: 'Hace 5 dias',
			priority: 'urgente',
			pending: true
		},
		{
			id: '5',
			type: 'otros',
			clientName: 'Juan',
			clientLastName: 'Perez',
			numberId: 13983282,
			createdAt: 'Hace 5 dias',
			priority: 'normal',
			pending: false
		},
		{
			id: '6',
			type: 'hematologia',
			clientName: 'Juan',
			clientLastName: 'Perez',
			numberId: 13983282,
			createdAt: 'Hace 5 dias',
			priority: 'urgente',
			pending: true
		},
		{
			id: '7',
			type: 'hematologia',
			clientName: 'Juan',
			clientLastName: 'Perez',
			numberId: 13983282,
			createdAt: 'Hace 5 dias',
			priority: 'urgente',
			pending: true
		}
	];

	// TODO: Maybe can exist an search component
	let inputSearch = $state('');

	// TODO: Move modal to single component AddExamModal
	let showModal = $state(false);

	// TODO: USe SuperForms
	let inputExamId = $state('');
	let autoId = $state(true);

	let priority = $state('');
	const priorities = ['normal', 'urgente'];

	let examType = $state('');
	const examTypes = ['hematologia', 'tipiaje sanguineo', 'otros'];

	let createNewPacient = $state(false);
	let pacientId = $state('23875912');
	let pacientFullname = $state('Andres Bello');
</script>

<div in:fade class="flex w-full flex-col gap-y-8">
	<BaseModal bind:showModal title="Añadir examen">
		<div class="flex flex-col space-y-4 px-8 py-2">
			<div>
				<p class="mb-4 text-lg font-semibold">Examen</p>

				<div class="mb-4 flex w-full justify-start">
					<Input
						wrapperClass="w-1/2"
						placeholder="Identificador del examen"
						bind:value={inputExamId}
						name="inputExamId"
					/>
					<Checkbox
						name="autoGenId"
						text="Autogenerar ID"
						wrapperClass="ml-2"
						bind:value={autoId}
					/>
				</div>
				<div class="flex gap-x-6">
					<Select
						bind:value={examType}
						items={examTypes}
						name="examType"
						required
						placeholder="Seleccionar el tipo de examen"
						formatter={formatCapital}
					/>

					<Select
						bind:value={priority}
						items={priorities}
						name="priority"
						required
						placeholder="Seleccionar prioridad"
						formatter={formatCapital}
					/>
				</div>
			</div>

			<hr class="border-primary-gray/50 border" />
			<div>
				<div class="mb-4 inline-flex gap-x-4">
					<p class="text-lg font-semibold">Paciente</p>
					<Checkbox
						name="createNewPacient"
						text="Crear nuevo paciente"
						wrapperClass="ml-2"
						bind:value={createNewPacient}
					/>
				</div>
				<div class="mb-4 flex items-center gap-x-2">
					<Input
						wrapperClass="w-1/2"
						placeholder="Nombre del paciente"
						bind:value={pacientId}
						name="pacientId"
						disabled
					/>
					<Icon src={UserSearch} size="24" />
				</div>
				<div>
					<Input
						wrapperClass="w-1/2"
						placeholder="Cedula del paciente"
						bind:value={pacientFullname}
						name="pacientFullname"
						disabled
					/>
				</div>
			</div>
		</div>
	</BaseModal>
	<p class="text-center text-3xl">Examenes</p>

	<div class="flex w-full justify-evenly">
		<SearchBar
			bind:inputSearch
			name="examSearch"
			placeholder="Busca un examen por paciente o tipo de examen"
			wrapperClass="w-4/5"
		/>
		<Button class="text-xl" onclick={() => (showModal = true)}>Nuevo +</Button>
	</div>

	<div class="mt-4 grid grid-cols-2 gap-3">
		{#each lastExams as exam}
			<div
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
			</div>
		{/each}
	</div>
</div>
