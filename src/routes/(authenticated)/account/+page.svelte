<script lang="ts">
	import { formatDateDMY, getAgeFromDate, IconRoles } from '$lib/client';
	import Button from '$lib/components/Button.svelte';
	import BackButton from '$lib/components/buttons/BackButton.svelte';
	import LabelValue from '$lib/components/LabelValue.svelte';
	import Link from '$lib/components/Link.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import {
		At,
		ClockEdit,
		ClockPlus,
		User,
		Id,
		Packages,
		Cake,
		Pencil,
		Trash,
		LockPassword
	} from '@steeze-ui/tabler-icons';
	import { fade } from 'svelte/transition';

	let { data } = $props();
</script>

<div in:fade class="mb-4 flex w-full flex-col gap-y-8">
	<div class="relative flex justify-center">
		<BackButton href="/home" size="40" />

		<p class="mx-auto my-0 text-center text-3xl">Mi cuenta</p>
	</div>

	<div>
		<div class="space-y-5">
			<p class="inline-flex items-center gap-x-2 text-2xl">
				<span> Datos personales </span>

				<span>
					<a href="/account/edit" title="Editar cuenta">
						<Icon src={Pencil} size="24" class="text-green-500 hover:text-green-600" />
					</a>
				</span>
			</p>

			<div class="grid grid-cols-2 gap-x-4 gap-y-3">
				<LabelValue
					icon={User}
					label="Nombre"
					value={`${data.user.firstName} ${data.user.lastName}`}
				/>

				<LabelValue icon={At} label="Correo" value={data.user.email} />

				<LabelValue
					icon={IconRoles[data.user.role]}
					label="Rol"
					value={data.user.role}
					class="flex items-center gap-x-1 capitalize"
				/>

				<LabelValue icon={Id} label="Cédula" value={data.user.documentId} />

				<LabelValue label="Cumpleaños" value={formatDateDMY(data.user.birthdate)} icon={Cake} />

				<LabelValue label="Edad" value={getAgeFromDate(data.user.birthdate)} icon={Packages} />

				<LabelValue label="Creado" value={data.user.createdAt.toLocaleString()} icon={ClockPlus} />

				{#if data.user.createdAt.getTime() !== data.user.updatedAt.getTime()}
					<LabelValue
						label="Último cambio"
						value={data.user.updatedAt.toLocaleString()}
						icon={ClockEdit}
					/>
				{/if}
			</div>

			<hr class="border-primary-gray/50 my-4" />

			<p class="inline-flex items-center gap-x-2 text-2xl">Seguridad</p>

			<div class="flex items-center gap-x-2">
				<Link
					href="/account/change-password"
					title="Cambia tu contraseña"
					class="!bg-primary-blue hover:!bg-primary-blue/75 inline-flex items-center gap-x-1"
				>
					<span>
						<Icon src={LockPassword} size="22" />
					</span>
					<span>Cambiar contraseña</span>
				</Link>

				<!-- TODO: Implement with a confirm modal -->
				<Button
					onclick={() => alert('Eliminar cuenta - Funcionalidad no implementada')}
					title="Eliminar tu cuenta"
					class="inline-flex items-center gap-x-1 !bg-red-400 hover:!bg-red-500"
				>
					<span>
						<Icon src={Trash} size="22" />
					</span>
					<span>Desactivar cuenta</span>
				</Button>
			</div>
		</div>
	</div>
</div>
