<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { showToast } from '$lib/toasts.js';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import BackButton from '$lib/components/buttons/BackButton.svelte';
	import Input from '$lib/components/Input.svelte';
	import { Cake, Id } from '@steeze-ui/tabler-icons';
	import { formatCapital, maxDocumentId, minDocumentId } from '$lib/shared/utils.js';
	import Select from '$lib/components/Select.svelte';
	import { PatientGender } from '$lib/shared/enums.js';
	import Button from '$lib/components/Button.svelte';

	let { data } = $props();

	const { form, errors, constraints, enhance } = superForm(data.createPatientForm, {
		dataType: 'json',
		delayMs: 0,
		applyAction: true,
		onUpdated({ form }) {
			// Display message based on the response
			if (form.message) {
				showToast(form.message.text, form.message.type);

				if (form.message.type == 'success') {
					goto('/clients');
				}
			}
		}
	});
</script>

<form in:fade class="mb-4 flex w-full flex-col gap-y-8" use:enhance method="POST">
	<div class="relative flex justify-center">
		<BackButton href="/clients" size="40" />

		<p class="mx-auto text-center text-3xl">Añadir nuevo paciente</p>
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
						error={$errors.firstName}
					/>
				</div>

				<div class="flex gap-x-8">
					<Input
						bind:value={$form.documentId}
						name="documentId"
						label="Cédula de Identidad"
						placeholder="Cédula"
						wrapperClass="w-1/3"
						type="number"
						autoComplete={false}
						error={$errors.documentId}
					/>

					<div class="flex flex-col items-start gap-y-1">
						<label class="ml-2 font-semibold" for="select-gender"> Género </label>
						<Select
							bind:value={$form.gender}
							name="gender"
							id="select-gender"
							items={Object.values(PatientGender).map((role_) => ({
								value: role_,
								label: formatCapital(role_ === PatientGender.Female ? 'Mujer' : 'Hombre')
							}))}
							forcePlaceholder
							required
							placeholder="Selecciona género"
							class="w-1/3"
						/>
					</div>

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

					<Input
						bind:value={() => $form.phoneNumber ?? '', (v) => ($form.phoneNumber = v)}
						name="phoneNumber"
						label="Teléfono (opcional)"
						placeholder="Número de teléfono"
						wrapperClass="w-1/2"
						autoComplete={false}
						error={$errors.documentId}
					/>
				</div>
			</div>
		</div>
	</div>

	<hr class="border-primary-gray/50 my-1" />

	<div class="mx-auto w-fit space-x-10">
		<Button
			title="Cancelar"
			class="w-fit !bg-red-500 hover:!bg-red-400"
			onclick={() => goto('/clients')}>Cancelar</Button
		>

		<Button title="Guardar paciente" class="w-fit !bg-green-500 hover:!bg-green-400" type="submit">
			Guardar
		</Button>
	</div>
</form>
