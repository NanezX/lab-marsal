<script lang="ts">
	import { getAgeFromDate } from '$lib/client';
	import { getUserContext } from '$lib/client/context';
	import BackButton from '$lib/components/buttons/BackButton.svelte';
	import LabelValue from '$lib/components/LabelValue.svelte';
	import { UserRoles } from '$lib/shared/enums';
	import type { IconSource } from '@steeze-ui/svelte-icon';
	import {
		At,
		ClockEdit,
		ClockPlus,
		User,
		Shield,
		Seeding,
		Microscope,
		Folder,
		Id,
		Packages,
		Cake
	} from '@steeze-ui/tabler-icons';
	import { fade } from 'svelte/transition';

	// const IconRoles: Record<string, typeof ShieldOutline> = {
	const IconRoles: Record<string, IconSource> = {
		[UserRoles.Admin]: Shield,
		[UserRoles.Auxiliar]: Seeding,
		[UserRoles.Bioanalista]: Microscope,
		[UserRoles.Secretaria]: Folder
	};

	const dataUser = getUserContext();
</script>

<div in:fade class="mb-4 flex w-full flex-col gap-y-8">
	<div class="relative flex justify-center">
		<BackButton href="/home" size="40" />

		<p class="mx-auto my-0 text-center text-3xl">Mi cuenta</p>
	</div>

	<div>
		<div class="space-y-5">
			<p class="text-2xl">Datos personales</p>

			<div class="grid grid-cols-2 gap-x-4 gap-y-3">
				<LabelValue
					icon={User}
					label="Nombre"
					value={`${dataUser.firstName} ${dataUser.lastName}`}
				/>

				<LabelValue icon={At} label="Correo" value={dataUser.email} />

				<LabelValue
					icon={IconRoles[dataUser.role]}
					label="Rol"
					value={dataUser.role}
					class="flex items-center gap-x-1 capitalize"
				/>

				<LabelValue icon={Id} label="Cédula" value={dataUser.documentId} />

				<LabelValue
					label="Cumpleaños"
					value={dataUser.birthdate.toLocaleDateString()}
					icon={Cake}
				/>
				<LabelValue label="Edad" value={getAgeFromDate(dataUser.birthdate)} icon={Packages} />

				<LabelValue label="Creado" value={dataUser.createdAt.toLocaleString()} icon={ClockPlus} />

				{#if dataUser.createdAt.getTime() !== dataUser.updatedAt.getTime()}
					<LabelValue
						label="Último cambio"
						value={dataUser.updatedAt.toLocaleString()}
						icon={ClockEdit}
					/>
				{/if}
			</div>
		</div>
	</div>
</div>
