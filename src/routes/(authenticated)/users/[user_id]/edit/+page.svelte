<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { fade } from 'svelte/transition';
	import BackButton from '$lib/components/buttons/BackButton.svelte';
	import Input from '$lib/components/Input.svelte';
	import { cleanEditUserData, maxDocumentId, minDocumentId } from '$lib/shared/utils.js';
	import Select from '$lib/components/Select.svelte';
	import Button from '$lib/components/Button.svelte';
	import CloseNavigationGuard from '$lib/components/modal/CloseNavigationGuard.svelte';
	import { isEqual } from 'lodash-es';
	import ConfirmModal from '$lib/components/modal/ConfirmModal.svelte';
	import type { PageProps } from './$types';
	import { At, Id, User } from '@steeze-ui/tabler-icons';
	import { userRolesItems } from '$lib/client';
	import LabelValue from '$lib/components/LabelValue.svelte';

	let { data }: PageProps = $props();

	let { editUserForm, userData } = data;

	const {
		form,
		errors,
		constraints,
		enhance,
		submit: submitChanges
	} = superForm(editUserForm, {
		dataType: 'json',
		delayMs: 0,
		applyAction: true,
		onResult(event) {
			// If forms result type is a redirect or success, we assume that the changes were saved
			if (event.result.type === 'redirect' || event.result.type === 'success') {
				hasChanges = false;
			}
		}
	});

	// Compare form vs original data
	const original = cleanEditUserData(userData);

	let hasChanges = $derived(!isEqual($form, original));
	let showConfirmModal = $state(false);
	let showDiscardModal = $state(false);
</script>

<CloseNavigationGuard validator={() => hasChanges} bind:needConfirm={showDiscardModal} />

<ConfirmModal
	bind:showModal={showConfirmModal}
	title="Confirmar cambios"
	secondaryText="Esto puede afectar el acceso del usuario"
	saveButtonText="Guardar cambios"
	cancelButtonText="Cancelar"
	onSave={() => {
		submitChanges();
		return true;
	}}
/>

<form in:fade class="mb-4 flex w-full flex-col gap-y-8" use:enhance method="POST">
	<div class="relative flex justify-center">
		<BackButton href="/users" size="40" />

		<p class="mx-auto text-center text-3xl">Editar usuario</p>
	</div>

	<div>
		<div class="space-y-5">
			<p class="text-2xl">Datos</p>

			<div class="space-y-4">
				<div class="flex gap-x-8">
					<LabelValue label="Nombre" value="{userData.firstName} {userData.lastName}" icon={User} />
				</div>

				<div class="flex gap-x-8">
					<!-- Document ID -->
					<Input
						bind:value={$form.documentId}
						label="Cédula"
						name="documentId"
						type="number"
						required
						icon={Id}
						placeholder="Cédula"
						autoComplete={false}
						min={minDocumentId}
						max={maxDocumentId}
						wrapperClass="col-span-3"
						error={$errors.email}
						{...$constraints.documentId}
					/>

					<!-- Email -->
					<Input
						bind:value={$form.email}
						label="Correo"
						name="email"
						type="email"
						required
						icon={At}
						placeholder="Correo electrónico"
						autoComplete={false}
						wrapperClass="col-span-4"
						error={$errors.email}
						{...$constraints.email}
					/>

					<!-- User roles - Select -->
					<div class="flex flex-col items-start gap-y-1">
						<label class="ml-2 font-semibold" for="select-gender"> Rol </label>

						<Select
							bind:value={$form.role}
							items={userRolesItems}
							name="role"
							id="select-role"
							required
							placeholder="Selecciona un rol"
							class="w-1/3"
							{...$constraints.role}
						/>
						{#if $errors.role}<span class="text-sm text-red-500">{$errors.role}</span>{/if}
					</div>
				</div>
			</div>
		</div>
	</div>

	<hr class="border-primary-gray/50 my-1" />

	<div class="mx-auto w-fit space-x-10">
		<Button
			disabled={!hasChanges}
			onclick={() => (showConfirmModal = true)}
			title="Guardar cambios"
			class="w-fit !bg-green-500 hover:!bg-green-400 disabled:!bg-gray-200"
		>
			Guardar cambios
		</Button>
	</div>
</form>
