<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { fade } from 'svelte/transition';
	import BackButton from '$lib/components/buttons/BackButton.svelte';
	import Input from '$lib/components/Input.svelte';
	import { formatCapital } from '$lib/shared/utils.js';
	import Select from '$lib/components/Select.svelte';
	import { ExamPriority, PatientGender } from '$lib/shared/enums.js';
	import Button from '$lib/components/Button.svelte';
	import Link from '$lib/components/Link.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import SelectInput from '$lib/components/SelectInput.svelte';
	import type { PatientDiscriminator } from '$lib/server/utils/zod';

	let { data } = $props();

	let { createExamForm } = data;

	const { form, errors, constraints, enhance } = superForm(createExamForm, {
		dataType: 'json',
		delayMs: 0,
		applyAction: true
	});

	const priorityItems = Object.values(ExamPriority).map((priority_) => ({
		value: priority_,
		label: formatCapital(
			priority_ === ExamPriority.Low ? 'Baja' : priority_ === ExamPriority.High ? 'Alta' : 'Normal'
		)
	}));

	function isNewPatient(
		patient: PatientDiscriminator
	): patient is Extract<PatientDiscriminator, { kind: 'new' }> {
		return patient.kind === 'new';
	}

	function toggleExamId(kind_: 'auto' | 'manual') {
		form.update(($form) => {
			if (kind_ == 'auto') {
				$form.customId = {
					kind: 'auto',
					id: null
				};
			} else {
				$form.customId = {
					kind: 'manual',
					id: ''
				};
			}

			return $form;
		});
	}

	function togglePatient(kind_: 'new' | 'existing') {
		form.update(($form) => {
			if (kind_ === 'existing') {
				// Change to existing
				$form.patient = {
					kind: 'existing',
					id: ''
				};
			} else {
				// Change to new
				$form.patient = {
					kind: 'new',
					data: {
						firstName: '',
						lastName: '',
						documentId: 0,
						birthdate: '',
						gender: PatientGender.Female
						// Email and phone number are optional
					}
				};
			}

			return $form;
		});
	}
</script>

<form in:fade class="mb-4 flex w-full flex-col gap-y-8" use:enhance method="POST">
	<div class="relative flex justify-center">
		<BackButton href="/exams" size="40" />

		<p class="mx-auto text-center text-3xl">Crear exámen</p>
	</div>

	<div>
		<div class="space-y-5">
			<p class="text-2xl">Exámen</p>
			<div class="space-y-4">
				<!-- Examen data -->

				<div class="flex w-full items-center gap-x-2">
					<Input
						wrapperClass="w-1/2"
						label="Identificador del examen"
						placeholder="Identificador del examen"
						bind:value={() => $form.customId.id ?? '', (v) => ($form.customId.id = v)}
						name="customIdInput"
						disabled={$form.customId.kind === 'auto'}
						title={$form.customId.kind === 'auto'
							? 'Generando identificador automáticamente'
							: 'Ingrese un identificador'}
					/>
					<Checkbox
						name="customIdType"
						text="Autogenerar ID"
						title="Generar automáticamente el identificar"
						wrapperClass="!m-0"
						bind:value={
							() => $form.customId.kind === 'auto', (v) => toggleExamId(v ? 'auto' : 'manual')
						}
						error={$errors.customId?.kind}
					/>
				</div>

				<div class="flex gap-x-6">
					<div class="flex w-1/2 flex-col gap-y-1 px-0.5">
						<label class="ml-2 font-semibold" for="examTypeId"> Tipo de exámen </label>

						<SelectInput
							bind:value={$form.examTypeId}
							placeholder="Buscar tipo de examen"
							fetch="/api/exam-types/search?q=[query]"
							name="examTypeId"
							inputId="examTypeId"
							valueField="id"
							labelField="name"
							error={$errors.examTypeId}
						/>
					</div>

					<div class="flex flex-col items-start gap-y-1">
						<label class="ml-2 font-semibold" for="select-priority"> Prioridad </label>

						<Select
							bind:value={$form.priority}
							items={priorityItems}
							name="priority"
							id="select-priority"
							required
							placeholder="Seleccionar prioridad"
						/>
					</div>
				</div>
			</div>

			<hr class="border-primary-gray/50 my-4" />

			<div class="mb-4 inline-flex gap-x-4">
				<p class="text-2xl">Paciente</p>
				<Checkbox
					name="createNewPacient"
					text="Crear nuevo paciente"
					wrapperClass="my-auto !text-base border border-transparent hover:border-primary-blue/75 rounded-lg px-1 py-0.5"
					bind:value={
						() => $form.patient.kind === 'new', (v) => togglePatient(v ? 'new' : 'existing')
					}
				/>
			</div>
			<div class="space-y-4">
				<!-- Paciente data-->
				{#if isNewPatient($form.patient)}
					<div class="space-y-4">
						<div class="flex gap-x-8">
							<Input
								bind:value={$form.patient.data.firstName}
								name="firstName"
								label="Nombre"
								placeholder="Nombre del paciente"
								wrapperClass="w-1/2"
								error={$errors.patient?.data?.firstName}
							/>

							<Input
								bind:value={$form.patient.data.lastName}
								name="lastName"
								label="Apellido"
								placeholder="Apellido del paciente"
								wrapperClass="w-1/2"
								error={$errors.patient?.data?.lastName}
							/>
						</div>

						<div class="flex gap-x-8">
							<Input
								bind:value={
									() => {
										return isNewPatient($form.patient)
											? $form.patient.data.documentId === 0
												? ''
												: $form.patient.data.documentId
											: '';
									},
									(v) => {
										if (isNewPatient($form.patient))
											$form.patient.data.documentId = v === '' ? 0 : v;
									}
								}
								name="documentId"
								label="Cédula de Identidad"
								placeholder="Cédula"
								wrapperClass="w-1/3"
								type="number"
								autoComplete={false}
								error={$errors.patient?.data?.documentId}
							/>

							<div class="flex flex-col items-start gap-y-1">
								<label class="ml-2 font-semibold" for="select-gender"> Género </label>
								<Select
									bind:value={$form.patient.data.gender}
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
								bind:value={$form.patient.data.birthdate}
								name="birthdate"
								label="Cumpleaños"
								type="date"
								required
								placeholder="Cumpleaños"
								wrapperClass="w-1/3"
								{...$constraints.patient?.data?.birthdate}
							/>
						</div>

						<div class="mt-8 flex gap-x-8">
							<Input
								bind:value={
									() => (isNewPatient($form.patient) ? ($form.patient.data.email ?? '') : ''),
									(v) => {
										if (isNewPatient($form.patient)) $form.patient.data.email = v;
									}
								}
								type="email"
								name="email"
								label="Correo electrónico (opcional)"
								placeholder="Correo electrónico"
								autoComplete={false}
								wrapperClass="w-1/2"
								error={$errors.patient?.data?.email as string | string[] | undefined}
							/>

							<Input
								bind:value={
									() => (isNewPatient($form.patient) ? ($form.patient.data.phoneNumber ?? '') : ''),
									(v) => {
										if (isNewPatient($form.patient)) $form.patient.data.phoneNumber = v;
									}
								}
								name="phoneNumber"
								label="Teléfono (opcional)"
								placeholder="Número de teléfono"
								wrapperClass="w-1/2"
								autoComplete={false}
								error={$errors.patient?.data?.phoneNumber as string | string[] | undefined}
							/>
						</div>
					</div>
				{:else}
					<div class="flex w-1/2 flex-col gap-y-1 px-0.5">
						<label class="ml-2 font-semibold" for="examTypeId"> Buscar </label>

						<SelectInput
							bind:value={$form.patient.id}
							placeholder="Buscar paciente por nombre o cédula"
							fetch="/api/patients/search?minimal=true&q=[query]"
							name="patientId"
							inputId="patientId"
							valueField="id"
							labelField="name"
							error={$errors.patient?.id}
						/>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<hr class="border-primary-gray/50 my-1" />

	<div class="mx-auto w-fit space-x-10">
		<Link href="/exams" title="Cancelar" class="w-fit !bg-red-500 hover:!bg-red-400">Cancelar</Link>

		<Button title="Guardar paciente" class="w-fit !bg-green-500 hover:!bg-green-400" type="submit">
			Guardar
		</Button>
	</div>
</form>
