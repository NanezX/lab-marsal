<script lang="ts">
	import type { PageProps } from './$types';
	import { fade } from 'svelte/transition';
	import Link from '$lib/components/Link.svelte';
	import BackButton from '$lib/components/buttons/BackButton.svelte';
	import Button from '$lib/components/Button.svelte';
	import { superForm } from 'sveltekit-superforms';
	import ConfirmModal from '$lib/components/modal/ConfirmModal.svelte';
	import { getAgeFromDate } from '$lib/client';
	import { PatientGender } from '$lib/shared/enums';
	import {
		Id,
		GenderMale,
		GenderFemale,
		Cake,
		Man,
		Woman,
		Mail,
		Phone,
		ClockPlus,
		ClockEdit
	} from '@steeze-ui/tabler-icons';
	import LabelValue from '$lib/components/LabelValue.svelte';
	import FilterControls from '$lib/components/FilterControls.svelte';

	// TODO: Verify AND check what roles can remove/delete an exam type (maybe just block the page to those user in the backend)
	// TODO: Add exams created (and NOT deleted) for the users

	let { data }: PageProps = $props();

	let { patientData, deletePatientForm, patienExamsData, totalExamsCount } = data;

	const { enhance, submit: submitDelete } = superForm(deletePatientForm, {
		dataType: 'json',
		delayMs: 0,
		applyAction: true
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

<div in:fade class="mb-4 flex w-full flex-col gap-y-8">
	<form use:enhance method="POST" hidden></form>

	<div class="relative flex justify-center">
		<BackButton href="/clients" size="40" />

		<p class="mx-auto my-0 text-center text-3xl">{patientData.firstName} {patientData.lastName}</p>

		<div>
			<Link
				href="/clients/{patientData.id}/edit"
				title="Crear nuevo exámen"
				class="!bg-green-400 hover:!bg-green-500">Editar</Link
			>

			<Button
				type="button"
				onclick={() => (showConfirmDeleteModal = !showConfirmDeleteModal)}
				class="bg-red-400 hover:bg-red-500">Eliminar</Button
			>
		</div>
	</div>

	<div>
		<div class="space-y-5">
			<p class="text-2xl">Datos personales</p>

			<div class="grid grid-cols-2 gap-x-4 gap-y-3">
				<LabelValue label="Cédula" value={patientData.documentId} icon={Id} />

				<LabelValue
					label="Género"
					value={patientData.gender == PatientGender.Male ? 'Hombre' : 'Mujer'}
					icon={patientData.gender == PatientGender.Male ? GenderMale : GenderFemale}
				/>

				<LabelValue
					label="Edad"
					value={getAgeFromDate(patientData.birthdate)}
					icon={patientData.gender == PatientGender.Male ? Man : Woman}
				/>

				<LabelValue label="Correo electrónico" value={patientData.email ?? 'N/A'} icon={Mail} />

				<LabelValue
					label="Fecha de nacimiento"
					value={patientData.birthdate.toLocaleDateString()}
					icon={Cake}
				/>
				<LabelValue label="Teléfono" value={patientData.phoneNumber ?? 'N/A'} icon={Phone} />

				<LabelValue
					class="mt-2 flex items-center gap-x-1"
					label="Creado"
					value={patientData.createdAt.toLocaleString()}
					icon={ClockPlus}
				/>

				{#if patientData.createdAt.getTime() !== patientData.updatedAt.getTime()}
					<LabelValue
						class="mt-2 flex items-center gap-x-1"
						label="Último cambio"
						value={patientData.updatedAt.toLocaleString()}
						icon={ClockEdit}
					/>
				{/if}
			</div>
		</div>

		<hr class="border-primary-gray/50 my-4" />

		<div class="space-y-5">
			<p class="text-2xl">Últimos exámenes</p>
		</div>

		<!-- Pagination -->
		<!-- <FilterControls
			baseUrl="/exam-types"
			totalItems={data.countTotal}
			bind:queryParams={
				() => {
					return { name: nameSearch };
				},
				(v) => {
					nameSearch = v['name'];
				}
			}
		/> -->
	</div>
</div>
