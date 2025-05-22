<script lang="ts">
	import type { PageProps } from './$types';
	import { fade } from 'svelte/transition';
	import { sortArrayObject } from '$lib/shared/utils';
	import DisplayExamTypeParams from '$lib/components/DisplayExamTypeParams.svelte';
	import Link from '$lib/components/Link.svelte';
	import BackButton from '$lib/components/buttons/BackButton.svelte';
	import Button from '$lib/components/Button.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { showToast } from '$lib/toasts';
	import { goto } from '$app/navigation';
	import ConfirmModal from '$lib/components/modal/ConfirmModal.svelte';

	// TODO: Verify AND check what roles can remove/delete an exam type (maybe just block the page to those user in the backend)

	let { data }: PageProps = $props();

	let { patientData, deletePatientForm } = data;

	const { enhance, submit: submitDelete } = superForm(deletePatientForm, {
		dataType: 'json',
		delayMs: 0,
		applyAction: true,
		onUpdated({ form }) {
			// Display message based on the response
			if (form.message) {
				showToast(form.message.text, form.message.type);

				if (form.message.type == 'success') {
					goto(`/clients`);
				}
			}
		}
	});

	let showConfirmDeleteModal = $state(false);
</script>

<ConfirmModal
	bind:showModal={showConfirmDeleteModal}
	title="Eliminar paciente"
	text="¿Estás seguro de eliminar este paciente?"
	secondaryText="Esto eliminará los exámenes con este paciente. La cédula de identidad de este paciente no podrá ser registrada de nuevo"
	saveButtonText="Eliminar"
	cancelButtonText="Cancelar"
	onSave={() => {
		submitDelete();
		return true;
	}}
/>
