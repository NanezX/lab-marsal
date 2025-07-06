<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { fade } from 'svelte/transition';
	import BackButton from '$lib/components/buttons/BackButton.svelte';
	import Input from '$lib/components/Input.svelte';
	import Button from '$lib/components/Button.svelte';
	import { isEqual } from 'lodash-es';
	import CloseNavigationGuard from '$lib/components/modal/CloseNavigationGuard.svelte';
	import ConfirmModal from '$lib/components/modal/ConfirmModal.svelte';

	let { data } = $props();

	const { configurationData, editConfigForm } = data;

	const {
		form,
		errors,
		constraints,
		enhance,

		submit: submitChanges
	} = superForm(editConfigForm, {
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

	const original = configurationData;

	let hasChanges = $derived(!isEqual($form, original));
	let showConfirmModal = $state(false);
	let showDiscardModal = $state(false);
</script>

<CloseNavigationGuard validator={() => hasChanges} bind:needConfirm={showDiscardModal} />

<ConfirmModal
	bind:showModal={showConfirmModal}
	title="Confirmar cambios"
	secondaryText="Esto puede afectar en como se imprimen los exámenes ya creados"
	saveButtonText="Guardar cambios"
	cancelButtonText="Cancelar"
	onSave={() => {
		submitChanges();
		return true;
	}}
/>

<form in:fade class="flex w-full flex-col gap-y-8" use:enhance method="POST">
	<div class="relative flex justify-center">
		<BackButton href="/home" size="40" />

		<p class="mx-auto text-center text-3xl">Configuración</p>
	</div>

	<div class="space-y-6">
		<!--  -->
		<div class="flex gap-x-8">
			<Input
				bind:value={$form.orgFullName}
				name="orgFullName"
				label="Nombre del laboratorio"
				placeholder="Nombre del laboratorio"
				wrapperClass="w-1/2"
				error={$errors.orgFullName}
			/>
			<Input
				bind:value={$form.orgRif}
				name="orgRif"
				label="RIF del laboratorio"
				placeholder="RIF del laboratorio"
				wrapperClass="w-1/2"
				error={$errors.orgRif}
			/>
		</div>

		<div class="flex gap-x-8">
			<Input
				bind:value={$form.orgAddress}
				name="orgAddress"
				label="Dirección del laboratorio"
				placeholder="Dirección del laboratorio"
				wrapperClass="w-1/2"
				error={$errors.orgAddress}
			/>

			<Input
				bind:value={$form.orgEmail}
				name="orgEmail"
				label="Correo electrónico del laboratorio"
				placeholder="Correo electrónico  del laboratorio"
				wrapperClass="w-1/2"
				error={$errors.orgEmail}
			/>
		</div>

		<div class="flex gap-x-8">
			<Input
				bind:value={$form.orgPhones}
				name="orgPhones"
				label="Telefonos del laboratorio"
				placeholder="Telefonos del laboratorio"
				wrapperClass="w-1/2"
				error={$errors.orgPhones}
			/>
		</div>
	</div>

	<hr class="border-primary-gray/50 my-1" />

	<div class="mx-auto w-fit space-x-10">
		<Button
			type="button"
			disabled={!hasChanges}
			onclick={() => (showConfirmModal = true)}
			title="Guardar cambios"
			class="w-fit !bg-green-500 hover:!bg-green-400 disabled:!bg-gray-200"
		>
			Guardar cambios
		</Button>
	</div>
</form>
