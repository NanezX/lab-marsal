<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { fade } from 'svelte/transition';
	import BackButton from '$lib/components/buttons/BackButton.svelte';
	import Input from '$lib/components/Input.svelte';
	import { formatCapital } from '$lib/shared/utils.js';
	import Select from '$lib/components/Select.svelte';
	import { PatientGender } from '$lib/shared/enums.js';
	import Button from '$lib/components/Button.svelte';
	import Link from '$lib/components/Link.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';

	let { data } = $props();

	let { createExamForm } = data;

	const { form, errors, constraints, enhance } = superForm(createExamForm, {
		dataType: 'json',
		delayMs: 0,
		applyAction: true
	});

	let inputExamId = $state('');
	let autoId = $state(false);

	let examType = $state('');
	const examTypes = ['Hematologia', 'Tipiaje sanguineo', 'Otros'];

	let priority = $state('');
	const priorities = ['Normal', 'Urgente'];
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
						bind:value={inputExamId}
						name="customIdInput"
					/>
					<Checkbox
						name="customIdType"
						text="Autogenerar ID"
						title="Generar automáticamente el identificar"
						wrapperClass="!m-0"
						bind:value={
							() => $form.customId.kind === 'auto',
							(v) => ($form.customId.kind = v ? 'auto' : 'manual')
						}
						error={$errors.customId?.kind}
					/>
				</div>

				<div class="flex gap-x-6">
					<div>
						<label class="ml-2 font-semibold" for="examType"> Tipo de exámen </label>

						<Select
							bind:value={() => $form.examTypeId, (v) => ($form.examTypeId = v)}
							items={examTypes}
							id="examType"
							name="examType"
							required
							forcePlaceholder
							placeholder="Seleccionar el tipo de examen"
						/>
					</div>

					<!-- <Select
						bind:value={priority}
						items={priorities}
						name="priority"
						required
						placeholder="Seleccionar prioridad"
					/> -->
				</div>
			</div>

			<p class="text-2xl">Paciente</p>
			<div class="space-y-4">
				<!-- Paciente data-->
				<Checkbox
					name="createNewPacient"
					text="Crear nuevo paciente"
					wrapperClass="!m-0"
					bind:value={
						() => $form.patient.kind === 'new', (v) => ($form.patient.kind = v ? 'new' : 'existing')
					}
					error={'Debe seleccionar un usuario'}
				/>
				<!-- error={$errors.patient?.id} -->

				<p>
					createNewPacient: {$form.patient.kind}
				</p>
				<p>
					err: {$errors?.patient?.id?.[0]}
				</p>

				<button
					type="button"
					onclick={() => {
						console.log('$errors: ', $errors);
					}}>xdd</button
				>
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
