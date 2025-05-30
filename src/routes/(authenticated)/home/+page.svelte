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
		CircleCheck
	} from '@steeze-ui/tabler-icons';

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
		<img
			alt="El logo de MarsalLab"
			src={icon}
			width="220"
			height="220"
			class="rounded-2xl border-2 border-gray-200 p-2"
		/>
	</div>

	<div class="space-y-4">
		<div class="space-y-2 pt-2">
			<p class="text-center text-xl font-bold">Ultimos examenes vistos</p>
			<div class="grid grid-cols-2 gap-2">
				{#each lastExams as exam}
					<a
						use:zoom
						href="/exams/{exam.id}"
						class="group flex flex-col gap-y-2 rounded-sm border-2 border-gray-200 bg-gray-100/50 px-4 py-2 text-sm"
					>
						<div class="flex justify-between">
							<p>
								<span class="font-semibold">Tipo: </span>
								<span>{formatCapital(exam.type)}</span>
							</p>
							<p class="inline-flex gap-x-2">
								{#if exam.pending}
									<span class="font-semibold">Prioridad: </span>
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
						</div>
						<div class="flex justify-between">
							<p>
								<span class="font-semibold"> Cliente: </span>
								<span>
									{exam.clientName.at(0)}.
									{exam.clientLastName}
								</span>
							</p>
							<p><span class="font-semibold">Tipo:</span> {formatCapital(exam.type)}</p>
						</div>

						<div class="flex justify-between">
							<p><span class="font-semibold">Creacion:</span> {exam.createdAt}</p>
							<Icon src={FileSearch} size="20" class="group-hover:text-primary-blue" />
						</div>
					</a>
				{/each}
			</div>
		</div>

		<div class="space-y-2 pt-2">
			<p class="text-center text-xl font-bold">Ultimos clientes vistos</p>

			<div class="grid grid-cols-2 gap-2">
				{#each lastClients as client}
					<a
						use:zoom
						href="/clients/{client.id}"
						class="group flex flex-col gap-y-2 rounded-sm border-2 border-gray-200 bg-gray-100/50 px-4 py-2 text-sm"
					>
						<div class="flex justify-between">
							<p>
								<span class="font-semibold"> Nombre: </span>
								<span>
									{client.name.at(0)}.
									{client.lastName}
								</span>
							</p>
							<p><span class="font-semibold">Pendientes:</span> {client.pendingExams}</p>
						</div>

						<div class="flex justify-between">
							<p><span class="font-semibold">Ultima modificacion:</span> {client.updatedAt}</p>
							<Icon src={UserShare} size="20" class="group-hover:text-primary-blue" />
						</div>
					</a>
				{/each}
			</div>
		</div>
	</div>
</div>
