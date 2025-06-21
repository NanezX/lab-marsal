<script>
	import { superForm } from 'sveltekit-superforms';
	import { fade } from 'svelte/transition';
	import BackButton from '$lib/components/buttons/BackButton.svelte';
	import Input from '$lib/components/Input.svelte';
	import { cleanEditExamResults } from '$lib/shared/utils.js';
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
		HelpCircle
	} from '@steeze-ui/tabler-icons';
	import LabelValue from '$lib/components/LabelValue.svelte';
	import Textarea from '$lib/components/Textarea.svelte';
	import { Popover } from 'flowbite-svelte';
	import { Icon } from '@steeze-ui/svelte-icon';

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
						label="Muestra (opcional)"
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

					{#each examTypeData.categories as category, i (`category-${i}`)}
						<div class="space-y-4">
							<p class="text-lg font-semibold underline">{category}</p>

							<div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
								{#each $form.results as result, index (result.parameterId)}
									<!-- Values from the data to simplify access on html -->
									{@const parameterSnapshotIndex = examData.results.findIndex(
										(r) => r.parameterId === result.parameterId
									)}
									{@const parameterIndex = examData.examType.parameters.findIndex(
										(p) => p.id === result.parameterId
									)}

									{@const typeResult = parameterSnapshotIndex !== -1 ? 'SAVED' : 'NEW'}

									{@const parameterData =
										typeResult === 'NEW'
											? examData.examType.parameters[parameterIndex]
											: examData.results[parameterSnapshotIndex].parameterSnapshot}

									{#if parameterData.category === category}
										<!-- Actual HTML -->
										<div class="flex gap-x-1 order:[{parameterData.position}]">
											<Input
												bind:value={result.value}
												name="sample"
												placeholder="Valor del resultado"
												label={parameterData.name +
													(parameterData.unit ? ` (${parameterData.unit})` : '')}
												wrapperClass="w-full"
												error={$errors.results?.[index]?.value}
											/>

											<div class="relative">
												<div class="w-[24px]"></div>
												{#if parameterData.hasReferences}
													<Icon
														id="help-reference-values-{result.parameterId}"
														src={HelpCircle}
														size="24"
														class="text-primary-blue hover:text-primary-blue/75 absolute top-1/2 cursor-pointer"
													/>
													<!-- class="w-72 bg-white text-sm font-light text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400" -->
													<Popover
														title="Valores de referencia"
														triggeredBy="#help-reference-values-{result.parameterId}"
														trigger="click"
														class="border-primary-blue border"
														placement="top-start"
														transition={fade}
														transitionParams={{ duration: 150 }}
													>
														<div class="flex flex-col gap-2">
															{#each parameterData.referenceValues as refValues, i (`parameter-${i}`)}
																<p class="border-b-primary-blue not-last:border-b not-last:pb-2">
																	{refValues}
																</p>
															{/each}
														</div>
													</Popover>
												{/if}
											</div>
										</div>
									{/if}
								{/each}
							</div>
						</div>

						{#if examTypeData.categories.length !== i + 1}
							<hr class="border-primary-gray/50 my-1 mb-4" />
						{/if}
					{:else}
						<div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
							{#each $form.results as result, index (result.parameterId)}
								<!-- Values from the data to simplify access on html -->
								{@const parameterSnapshotIndex = examData.results.findIndex(
									(r) => r.parameterId === result.parameterId
								)}
								{@const parameterIndex = examData.examType.parameters.findIndex(
									(p) => p.id === result.parameterId
								)}

								{@const typeResult = parameterSnapshotIndex !== -1 ? 'SAVED' : 'NEW'}

								{@const parameterData =
									typeResult === 'NEW'
										? examData.examType.parameters[parameterIndex]
										: examData.results[parameterSnapshotIndex].parameterSnapshot}

								<!-- Actual HTML -->
								<div class="flex gap-x-1 order:[{parameterData.position}]">
									<Input
										bind:value={result.value}
										name="sample"
										placeholder="Valor del resultado"
										label={parameterData.name +
											(parameterData.unit ? ` (${parameterData.unit})` : '')}
										wrapperClass="w-full"
										error={$errors.results?.[index]?.value}
									/>

									<div class="relative">
										<div class="w-[24px]"></div>
										{#if parameterData.hasReferences}
											<Icon
												id="help-reference-values-{result.parameterId}"
												src={HelpCircle}
												size="24"
												class="text-primary-blue hover:text-primary-blue/75 absolute top-1/2 cursor-pointer"
											/>
											<!-- class="w-72 bg-white text-sm font-light text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400" -->
											<Popover
												title="Valores de referencia"
												triggeredBy="#help-reference-values-{result.parameterId}"
												trigger="click"
												class="border-primary-blue border"
												placement="top-start"
												transition={fade}
												transitionParams={{ duration: 150 }}
											>
												<div class="flex flex-col gap-2">
													{#each parameterData.referenceValues as refValues, i (`ref-value-${i}`)}
														<p class="not-last:border-b not-last:pb-2 border-b-primary-blue">
															{refValues}
														</p>
													{/each}
												</div>
											</Popover>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					{/each}
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
