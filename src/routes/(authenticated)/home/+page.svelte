<script lang="ts">
	import { zoom } from '$lib/components/actions/zoom.js';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { ChevronDown, UserCircle, UserShare } from '@steeze-ui/tabler-icons';
	import { fly } from 'svelte/transition';

	let { data } = $props();

	// TODO: Recheck the types laters coming from the DB
	type Client = {
		id: string;
		name: string;
		lastName: string;
		updatedAt: string;
		pendingExams: number;
	};

	// Last client views (max 4 clients). This should come already by latest view
	let lastClients: Client[] = [
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

	fly;
</script>

<div class="flex w-full flex-col">
	<p class="self-center bg-green-300 text-center">
		Hola {data.user.name}, bienvenido/a a LabMarsal App
	</p>

	<div class="space-y-4 divide-y-2">
		<div class="bg-red-500">
			<p class="text-center text-lg">Ultimos examenes vistos</p>
		</div>

		<div class="space-y-2 pt-2">
			<p class="text-center text-lg font-bold">Ultimos clientes vistos</p>

			<div class="grid grid-cols-2 gap-2">
				{#each lastClients as client}
					<a
						use:zoom
						href="/clients/{client.id}"
						class="group flex flex-col gap-y-2 rounded border bg-white px-4 py-2 text-sm shadow-lg"
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
