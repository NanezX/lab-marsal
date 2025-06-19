<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import BackButton from '$lib/components/buttons/BackButton.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Input from '$lib/components/Input.svelte';
	import ConfirmModal from '$lib/components/modal/ConfirmModal.svelte';
	import { LockOpen2, Lock } from '@steeze-ui/tabler-icons';
	import { fade } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();

	const {
		form,
		errors,
		constraints,
		enhance,
		submit: submitChanges
	} = superForm(data.editProfileForm, {
		dataType: 'json',
		delayMs: 0,
		applyAction: true
	});

	let showConfirmModal = $state(false);
</script>

<ConfirmModal
	bind:showModal={showConfirmModal}
	title="Confirmar cambio"
	secondaryText="Esta acción cambiará la información reflejada en tu perfil."
	saveButtonText="Confirmar"
	cancelButtonText="Cancelar"
	onSave={() => {
		submitChanges();
		return true;
	}}
/>

<form in:fade class="mb-4 flex w-full flex-col gap-y-8" use:enhance method="POST">
	<div class="relative flex justify-center">
		<BackButton href="/account" size="40" />

		<p class="mx-auto text-center text-3xl">Editar perfil</p>
	</div>

	<div>
		<div class="space-y-5">
			<p class="text-2xl">Datos personales</p>

			<div class="space-y-4">
				<div class="flex gap-x-8">
					<Input
						bind:value={$form.firstName}
						name="firstName"
						label="Nombre"
						placeholder="Nombre del paciente"
						wrapperClass="w-1/2"
						error={$errors.firstName}
					/>

					<Input
						bind:value={$form.lastName}
						name="lastName"
						label="Apellido"
						placeholder="Apellido del paciente"
						wrapperClass="w-1/2"
						error={$errors.lastName}
					/>
				</div>

				<div class="flex gap-x-8">
					<Input
						bind:value={
							() => ($form.documentId === 0 ? '' : $form.documentId),
							(v) => ($form.documentId = v === '' ? 0 : v)
						}
						name="documentId"
						label="Cédula de Identidad"
						placeholder="Cédula"
						wrapperClass="w-1/3"
						type="number"
						autoComplete={false}
						error={$errors.documentId}
					/>

					<Input
						bind:value={$form.birthdate}
						name="birthdate"
						label="Cumpleaños"
						type="date"
						required
						placeholder="Cumpleaños"
						wrapperClass="w-1/3"
						{...$constraints.birthdate}
					/>
				</div>

				<div class="mt-8 flex gap-x-8">
					<Input
						bind:value={() => $form.email ?? '', (v) => ($form.email = v)}
						type="email"
						name="email"
						label="Correo electrónico (opcional)"
						placeholder="Correo electrónico"
						autoComplete={false}
						wrapperClass="w-1/2"
						error={$errors.email}
					/>
				</div>
			</div>
		</div>
	</div>
</form>
