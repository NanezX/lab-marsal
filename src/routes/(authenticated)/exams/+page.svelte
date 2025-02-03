<script lang="ts">
	import { zoom } from '$lib/components/actions/zoom';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import { formatCapital } from '$lib/shared/utils';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { CircleCheck, CircleChevronsUp, CircleMinus, Search } from '@steeze-ui/tabler-icons';

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
</script>

<div class="flex w-full flex-col gap-y-8">
	<p class="text-center text-3xl">Examenes</p>

	<div class="flex w-full justify-evenly">
		<Input
			bind:value={inputSearch}
			name="examSearch"
			placeholder="Busca un examen por paciente o tipo de examen"
			icon={Search}
			wrapperClass="w-4/5"
		/>
		<Button class="text-xl">Nuevo +</Button>
	</div>

	<div class="mt-4 grid grid-cols-2 gap-3">
		{#each lastExams as exam}
			<div
				class="select-none rounded border bg-white px-4 py-2 text-lg hover:border hover:border-primary-blue hover:shadow-2xl"
				use:zoom={{ scale: 1.15, zindexIn: '99999', zindexOut: 'auto' }}
			>
				<div class="mb-2 flex">
					<p>
						<span class="font-semibold">Estado: </span>
						<span>{exam.pending ? 'En proceso' : 'Completado'}</span>
					</p>
					<p class="ml-auto w-fit rounded-full bg-secondary-gray/50 p-1"># {exam.id}</p>
				</div>
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

				<p class="text-end text-sm">Creada: {exam.createdAt}</p>
			</div>
		{/each}
	</div>
</div>
