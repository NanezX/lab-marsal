<script lang="ts">
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import type { ExamTypeSchema } from '../../routes/(authenticated)/exam-types/create/+page.server';
	import Input from '$lib/components/Input.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Button from '$lib/components/Button.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { CircleMinus, TextPlus, X } from '@steeze-ui/tabler-icons';
	import AddButton from '$lib/components/buttons/AddButton.svelte';
	import type { SuperFormData, SuperFormErrors } from 'sveltekit-superforms/client';
	import { deleteAndReindex } from '$lib/shared/utils';

	// Prop type
	type PropType = {
		form: SuperFormData<SuperValidated<Infer<ExamTypeSchema>>['data']>;
		errors: SuperFormErrors<SuperValidated<Infer<ExamTypeSchema>>['data']>;
	} & (
		| {
				category: string;
				addParameter: (category?: string) => void;
		  }
		| {
				category?: never;
				addParameter?: never;
		  }
	);

	let { form, errors, category, addParameter }: PropType = $props();

	/// DRAGEABLES  STATES
	let draggingItemIndex: number | null = $state(null);
	let hoveredItemIndex: number | null = $state(null);
	let container: HTMLDivElement | null = $state(null);
	let isOutside: boolean = $state(false);

	function onDragStart(index: number) {
		draggingItemIndex = index;
	}

	function onDragOver(index: number) {
		hoveredItemIndex = index;
	}

	function onDragEnd() {
		form.update(($form) => {
			if (
				draggingItemIndex != null &&
				hoveredItemIndex != null &&
				draggingItemIndex != hoveredItemIndex &&
				!isOutside
			) {
				// Reorganzize items
				[$form.parameters[draggingItemIndex], $form.parameters[hoveredItemIndex]] = [
					$form.parameters[hoveredItemIndex],
					$form.parameters[draggingItemIndex]
				];

				// Balance
				draggingItemIndex = hoveredItemIndex;
			}

			hoveredItemIndex = null;

			return $form;
		});
	}

	function windowOnDragOver(e: DragEvent & { currentTarget: EventTarget & Window }) {
		// Get the target element under the mouse
		const target = e.target;
		// const target = e.target as HTMLElement;

		if (target) {
			// If the target is NOT inside the container, set isOutside to true
			if (!(target as HTMLElement).closest('.drag-container')) {
				isOutside = true;
				return;
			}
		}
		isOutside = false;
	}

	function removeParameter(paramIndex_: number) {
		// Check if the parameter exists and if it has more than one element
		if ($form.parameters.length > 1 && $form.parameters[paramIndex_] !== undefined) {
			// Remove the parameter
			form.update(($form) => {
				$form.parameters.splice(paramIndex_, 1);
				return $form;
			});
		}
	}

	function addRefValue(paramIndex_: number) {
		// Check if the parameter exists
		if ($form.parameters[paramIndex_] !== undefined) {
			// Add a new reference value
			form.update(($form) => {
				$form.parameters[paramIndex_].referenceValues.push('');
				return $form;
			});
		}
	}

	function removeRefValue(paramIndex_: number, refValueIndex_: number) {
		// Check if the parameter and ref value exists and if it has more than one element
		if (
			$form.parameters[paramIndex_] !== undefined &&
			$form.parameters[paramIndex_].referenceValues.length > 1 &&
			$form.parameters[paramIndex_].referenceValues !== undefined
		) {
			// First remove the error on this index if exists
			errors.update(($errors) => {
				if ($errors.parameters?.[paramIndex_].referenceValues) {
					$errors.parameters[paramIndex_].referenceValues = deleteAndReindex(
						$errors.parameters[paramIndex_].referenceValues,
						refValueIndex_
					);
				}
				return $errors;
			});

			// Then update the form
			form.update(($form) => {
				$form.parameters[paramIndex_].referenceValues.splice(refValueIndex_, 1);
				return $form;
			});
		}
	}
</script>

<!-- To control when the drag ends outside of th drag container -->
<svelte:window ondragover={windowOnDragOver} />

{#each $form.parameters as _, index (index)}
	<!-- Handle rendering:
     - If no `category` prop is passed, all the parameters will be render
     - If a `category` prop is passed, only the parameters with the same category will be rendered
    -->
	{#if category === undefined || (category && $form.parameters[index].category === category)}
		<div
			role="definition"
			class="drag-container flex items-center gap-x-2"
			bind:this={container}
			data-param-index={index}
			id={index.toString()}
		>
			<!-- Drag handle area -->
			<div
				role="button"
				tabindex="0"
				aria-label="Drag handle for parameter {$form.parameters[index].position}"
				class="cursor-grab rounded-xl p-1 hover:bg-gray-100"
				draggable="true"
				ondragstart={() => onDragStart(index)}
				ondragend={() => onDragEnd()}
			>
				<svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			</div>

			<!-- Content area -->
			<div
				class="w-full rounded-xl bg-gray-100 px-2 py-4"
				role="listitem"
				aria-label="List of exam parameters"
				ondragover={() => onDragOver(index)}
			>
				<div class="grid grid-cols-2 items-start gap-4">
					<Input
						bind:value={$form.parameters[index].name}
						name={`parameter-${index}-name${category ? `-${category}` : ''}`}
						label="Nombre del parámetro"
						placeholder="Nombre del parámetro"
						autoComplete={false}
						error={$errors?.parameters?.[index]?.name}
					/>
					<Input
						bind:value={$form.parameters[index].unit}
						name="unit"
						label="Unidad del parámetro"
						placeholder="Unidad del parámetro"
						autoComplete={false}
						error={$errors?.parameters?.[index]?.unit}
					/>

					<Checkbox
						bind:value={
							() => $form.parameters[index].hasReferences,
							(v) => {
								if (v) {
									$form.parameters[index].referenceValues = [''];
								} else {
									$form.parameters[index].referenceValues = [];

									if ($errors?.parameters?.[index]?.referenceValues) {
										$errors.parameters[index].referenceValues = undefined;
									}
								}
								$form.parameters[index].hasReferences = v;
							}
						}
						text="Añadir valores de referencia"
						wrapperClass="!ml-0 !text-base"
					/>
				</div>

				{#if $form.parameters[index].hasReferences}
					<div class="mt-2 flex flex-col gap-y-1">
						<p class="ml-2 font-semibold">Valores de referencia</p>
						{#each $form.parameters[index].referenceValues as _, j_index (j_index)}
							<div class="flex gap-x-2">
								<Input
									wrapperClass="w-7/8"
									bind:value={$form.parameters[index].referenceValues[j_index]}
									name={`parameter-${index}-name-CATEGORY}`}
									placeholder="Valor de referencia"
									autoComplete={false}
									error={$errors?.parameters?.[index]?.referenceValues?.[j_index]}
								/>

								<Button
									class="!bg-inherit !p-0"
									title="Eliminar valor de referencia"
									onclick={() => {
										removeRefValue(index, j_index);
									}}
								>
									<Icon src={X} size="22" class="text-red-400 hover:text-red-600" />
								</Button>
							</div>
						{/each}

						<Button
							onclick={() => addRefValue(index)}
							title="Añadir nuevo valor de referencia"
							class="not-hover:text-primary-blue hover:text-dark-blue mx-auto mt-1 flex gap-x-1 !bg-inherit !p-0"
						>
							<p class="hover:underline">Añadir</p>
							<Icon src={TextPlus} size="24" class="" />
						</Button>
					</div>
				{/if}
			</div>

			<Button
				onclick={() => {
					removeParameter(index);
				}}
				class="!bg-inherit !p-0"
			>
				<Icon src={CircleMinus} size="32" theme="filled" class="text-red-500" />
			</Button>
		</div>
	{/if}
{/each}

{#if category && addParameter !== undefined}
	<div class="text-center">
		<AddButton
			title="Añadir parámetro"
			onclick={() => {
				addParameter(category);
			}}
		/>
	</div>
{/if}
