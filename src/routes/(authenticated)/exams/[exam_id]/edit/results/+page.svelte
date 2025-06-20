<script>
	import { superForm } from 'sveltekit-superforms';
	import { fade } from 'svelte/transition';
	import BackButton from '$lib/components/buttons/BackButton.svelte';
	import Input from '$lib/components/Input.svelte';
	import { cleanEditExamResults } from '$lib/shared/utils.js';
	import Select from '$lib/components/Select.svelte';
	import { PatientGender } from '$lib/shared/enums.js';
	import Button from '$lib/components/Button.svelte';
	import CloseNavigationGuard from '$lib/components/modal/CloseNavigationGuard.svelte';
	import { isEqual } from 'lodash-es';
	import ConfirmModal from '$lib/components/modal/ConfirmModal.svelte';
	import {
		Id,
		GenderMale,
		GenderFemale,
		User,
		Cash,
		ListTree,
		ClockPlus,
		ClockEdit
	} from '@steeze-ui/tabler-icons';
	import LabelValue from '$lib/components/LabelValue.svelte';
	import { examStatusItems, priorityItems } from '$lib/client/enumItems.js';
	import Textarea from '$lib/components/Textarea.svelte';

	let { data } = $props();

	let { editExamResultsForm, examData } = data;
	let { patient: patientData, examType: examTypeData } = examData;

	const {
		form,
		errors,
		enhance,
		submit: submitChanges
	} = superForm(editExamResultsForm, {
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

	const original = cleanEditExamResults(examData);

	let hasChanges = $derived(!isEqual($form, original));
	let showConfirmModal = $state(false);
	let showDiscardModal = $state(false);
</script>

<CloseNavigationGuard validator={() => hasChanges} bind:needConfirm={showDiscardModal} />

<ConfirmModal
	bind:showModal={showConfirmModal}
	title="Confirmar cambios"
	secondaryText="Revise los cambios realizados antes de confirmar"
	saveButtonText="Guardar cambios"
	cancelButtonText="Cancelar"
	onSave={() => {
		submitChanges();
		return true;
	}}
/>

<form in:fade class="mb-4 flex w-full flex-col gap-y-8" use:enhance method="POST">
	<div class="relative flex justify-center">
		<BackButton href="/exams/{examData.id}" size="40" />

		<p class="mx-auto text-center text-3xl">Editar resultados</p>
	</div>

	<div>
		<div class="grid grid-cols-2 gap-x-1 gap-y-5">
			<div>
				<p class="inline-flex items-center gap-x-1 text-2xl">Datos generales</p>

				<div class="space-y-0.5 px-1 py-2">
					<LabelValue label="Exámen" value={examTypeData.name} icon={Cash} />

					<LabelValue
						label="Clasificación"
						value={examTypeData.classification.name}
						icon={ListTree}
					/>
				</div>
			</div>

			<div>
				<p class="inline-flex items-center gap-x-1 text-2xl">Datos del paciente</p>

				<div class="space-y-0.5 px-1 py-2">
					<LabelValue
						label="Nombre"
						value="{patientData.firstName} {patientData.lastName}"
						icon={User}
						labelClass="mr-1"
					/>
					<LabelValue label="Cédula" value={patientData.documentId} icon={Id} labelClass="mr-1" />

					<LabelValue
						label="Género"
						value={patientData.gender == PatientGender.Male ? 'Hombre' : 'Mujer'}
						icon={patientData.gender == PatientGender.Male ? GenderMale : GenderFemale}
						labelClass="mr-1"
					/>
				</div>
			</div>

			<div class="col-span-2">
				<p class="mb-4 text-center text-2xl">Actualizar</p>

				<div class="space-y-4">
					<Input
						bind:value={() => $form.sample ?? '', (v) => ($form.sample = v)}
						name="sample"
						label="Muestra"
						placeholder="Muestra"
						wrapperClass="w-1/2"
						error={$errors.sample}
					/>

					<div class="flex flex-col gap-y-1">
						<label for="description-textarea" class="ml-2 font-semibold">
							Observación (opcional)
						</label>
						<Textarea
							bind:value={() => $form.observation ?? '', (v) => ($form.observation = v)}
							name="observation"
							placeholder="Observación del exámen"
						/>
					</div>

					<hr class="border-primary-gray/50 my-1 mb-4" />

					{#each $form.results as result, index (result.parameterId)}
						<Input
							bind:value={result.value}
							name="sample"
							label={examData.results.find((r) => r.parameterId === result.parameterId)
								?.parameterSnapshot.name ||
								examData.examType.parameters.find((p) => p.id === result.parameterId)?.name}
							placeholder="Valor del resultado"
							wrapperClass="w-1/2"
							error={$errors.results?.[index]?.value}
						/>
					{/each}

					<button
						type="button"
						onclick={() => {
							console.log('$form.results: ', $form.results);
							console.log('examData.examType.parameters: ', examData.examType.parameters);
							console.log('examData.results: ', data.examData.results);
						}}>Print</button
					>
				</div>
			</div>

			<div class="col-span-2">
				<hr class="border-primary-gray/50 my-1 mb-4" />

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
			</div>
		</div>
	</div>
</form>
