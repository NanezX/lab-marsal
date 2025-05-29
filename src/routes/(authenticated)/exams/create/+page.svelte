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
	/////////////
	import Svelecte from 'svelecte';
	import SelectInput from '$lib/components/SelectInput.svelte';

	let selectedExamType = $state<any>(null);

	const fetchExamTypes = async (input: string) => {
		'/api/exam-types/search?q=[query]';
		const response = await fetch(`/api/exam-types/search?q=${encodeURIComponent(input)}`);
		const data = await response.json();
		return data.map((item: any) => ({
			value: item.id,
			label: item.name
		}));
	};
	/////////////////////
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
	const priorityItems = Object.values(ExamPriority).map((priority_) => ({
		value: priority_,
		label: formatCapital(
			priority_ === ExamPriority.Low ? 'Baja' : priority_ === ExamPriority.High ? 'Alta' : 'Normal'
		)
	}));
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
							() => $form.customId.kind === 'auto',
							(v) => ($form.customId.kind = v ? 'auto' : 'manual')
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
						() => $form.patient.kind === 'new', (v) => ($form.patient.kind = v ? 'new' : 'existing')
					}
				/>
			</div>
			<div class="space-y-4">
				<!-- Paciente data-->
				{#if $form.patient.kind === 'new'}
					<p>new</p>
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

				<p>
					createNewPacient: {$form.patient.kind}
				</p>
				<p>
					err:
					<span in:fade class="text-sm text-red-500">
						{$errors?.patient?.id?.[0]}
					</span>
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
