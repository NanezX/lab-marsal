<script lang="ts">
	let { data } = $props();

	// TODO: Recheck the types laters coming from the DB
	type Client = {
		name: string;
		lastName: string;
		updatedAt: string;
		pendingExams: number;
	};

	// Last client views (max 4 clients). This should come already by latest view
	let lastClients: Client[] = [
		{
			name: 'Victor',
			lastName: 'Hernandez',
			updatedAt: 'Hace 2 horas',
			pendingExams: 1
		},
		{
			name: 'Yacsuri',
			lastName: 'Rios',
			updatedAt: 'Ayer',
			pendingExams: 0
		},
		{
			name: 'Juan',
			lastName: 'Perez',
			updatedAt: 'Hace 4 dias',
			pendingExams: 2
		},
		{
			name: 'Juan',
			lastName: 'Perez',
			updatedAt: 'Hace 1 semana',
			pendingExams: 0
		}
	];
</script>

<div class="flex w-full flex-col">
	<p class="self-center bg-green-300 text-center">
		Hola {data.user.name}, bienvenido/a a LabMarsal App
	</p>

	<div class="space-y-4">
		<div class="bg-red-500">
			<p class="text-center text-lg">Ultimos examenes vistos</p>
		</div>

		<div class="">
			<p class="text-center text-lg">Ultimos clientes vistos</p>

			<div class="grid grid-cols-2 gap-2">
				{#each lastClients as client}
					<div class="flex flex-col rounded border">
						<p>
							<strong> Nombre: </strong>
							<span>
								{client.name.at(0)}.
								{client.lastName}
							</span>
						</p>
						<p><strong>Pendientes:</strong> {client.pendingExams}</p>
						<p><strong>Ultima modificacion:</strong> {client.updatedAt}</p>
					</div>

					<!-- {client} -->
				{/each}
			</div>
		</div>
	</div>
</div>
