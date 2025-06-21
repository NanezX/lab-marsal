<script lang="ts">
	import type { PageProps } from './$types';
	import { fade } from 'svelte/transition';
	import Link from '$lib/components/Link.svelte';
	import BackButton from '$lib/components/buttons/BackButton.svelte';
	import Button from '$lib/components/Button.svelte';
	import { superForm } from 'sveltekit-superforms';
	import ConfirmModal from '$lib/components/modal/ConfirmModal.svelte';
	import { formatDateDMY, formatRelativeDate, getAgeFromDate } from '$lib/client';
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
		ClockEdit,
		FileSearch
	} from '@steeze-ui/tabler-icons';
	import LabelValue from '$lib/components/LabelValue.svelte';
	import FilterControls from '$lib/components/FilterControls.svelte';
	import ExamStatus from '$lib/components/ExamStatus.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';

	// TODO: Verify AND check what roles can remove/delete an exam type (maybe just block the page to those user in the backend)
	// TODO: Add exams created (and NOT deleted) for the users
	// TODO: Add fallback when no data found (no exams)

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

				<LabelValue label="Correo" value={patientData.email ?? 'N/A'} icon={Mail} />

				<LabelValue
					label="Fecha de nacimiento"
					value={formatDateDMY(patientData.birthdate)}
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
			<FilterControls baseUrl="/clients/{patientData.id}" totalItems={totalExamsCount} />

			<div
				class={[
					'mx-auto mt-4 grid gap-3',
					{
						'w-1/3 grid-cols-1': patienExamsData.length == 1,
						'w-2/3 grid-cols-2': patienExamsData.length == 2,
						'w-full grid-cols-3': patienExamsData.length >= 3
					}
				]}
			>
				{#each patienExamsData as exam (exam.id)}
					<a
						href="/exams/{exam.id}"
						title={exam.examType.name}
						class="group hover:border-primary-blue flex flex-col gap-y-2 rounded-sm border bg-white px-4 py-2 transition-all select-none hover:-translate-y-1 hover:border hover:shadow-2xl"
					>
						<div class="inline-flex w-full items-center justify-between">
							<ExamStatus status={exam.status} priority={exam.priority} minimal />
							<Icon
								src={FileSearch}
								size="24"
								class="group-hover:text-primary-blue self-end transition-all group-hover:scale-125"
							/>
						</div>
						<div class="space-y-0.5">
							<!-- <LabelValue label="Paciente" value={exam.patientName} /> -->
							<!-- <LabelValue label="Cédula" value={exam.patientDocumentId} /> -->
							<LabelValue label="Exámen" value={exam.examType.name} />
						</div>

						<LabelValue
							label="Último cambio"
							value={formatRelativeDate(exam.updatedAt)}
							class="mt-auto text-sm"
							labelClass="font-semibold"
						/>
					</a>
				{:else}
					<div class="col-span-2 xl:col-span-3">
						<p class="text-center text-lg font-semibold text-gray-500">No hay exámenes</p>
					</div>
				{/each}
			</div>

			<FilterControls baseUrl="/clients/{patientData.id}" totalItems={totalExamsCount} />
		</div>
	</div>
</div>
