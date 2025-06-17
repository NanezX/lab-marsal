<script lang="ts">
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import type { SuperFormData, SuperFormErrors } from 'sveltekit-superforms/client';
	import type { ExamTypeSchema } from '$lib/server/utils/zod';
	import Input from '$lib/components/Input.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Button from '$lib/components/Button.svelte';
	import AddButton from '$lib/components/buttons/AddButton.svelte';
	import { flip } from 'svelte/animate';
	import { onMount } from 'svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { CircleMinus, TextPlus, X } from '@steeze-ui/tabler-icons';
	import { deleteAndReindex } from '$lib/shared/utils';
	import { dndzone, type DndEvent } from 'svelte-dnd-action';
	import { v4 as uuidv4 } from 'uuid';

	// Prop type
	type PropType = {
		form: SuperFormData<SuperValidated<Infer<ExamTypeSchema>>['data']>;
		errors: SuperFormErrors<SuperValidated<Infer<ExamTypeSchema>>['data']>;
	} & {
		removeParameterCallback?: (paramIndex_: number) => void;
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

	const flipDurationMs = 300;
	let { form, errors, category, addParameter, removeParameterCallback }: PropType = $props();

	function removeParameter(paramIndex_: number) {
		// Check if the parameter exists and if it has more than one element
		if ($form.parameters.length > 1 && $form.parameters[paramIndex_] !== undefined) {
			// Use the callback first to not lose the index of the parameter
			if (removeParameterCallback) removeParameterCallback(paramIndex_);

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

	function handleDndConsider(
		e: CustomEvent<DndEvent<(typeof $form.parameters)[0] & { id: string }>>
	) {
		form.update(($form) => {
			$form.parameters = e.detail.items.map((item_, i_) => ({ ...item_, position: i_ }));
			return $form;
		});
	}

	function handleDndFinalize(e: CustomEvent<DndEvent<(typeof $form.parameters)[0]>>) {
		form.update(($form) => {
			$form.parameters = e.detail.items.map((item_, i_) => ({ ...item_, position: i_ }));
			return $form;
		});
	}

	// Add a stable id to each param exactly once
	onMount(() => {
		form.update(($form) => {
			$form.parameters = $form.parameters.map((p) => ({
				id: p.id ?? uuidv4(),
				...p
			}));
			return $form;
		});
	});
</script>

<div
	use:dndzone={{
		items: $form.parameters as Array<(typeof $form.parameters)[0] & { id: string }>,
		flipDurationMs: 200
	}}
	onconsider={handleDndConsider}
	onfinalize={handleDndFinalize}
>
	{#each $form.parameters as Array<(typeof $form.parameters)[0] & { id: string }> as parameter_, index_ (parameter_.id)}
		<!-- Handle rendering:
     - If no `category` prop is passed, all the parameters will be render
     - If a `category` prop is passed, only the parameters with the same category will be rendered
    -->
		<div
			animate:flip={{ duration: flipDurationMs }}
			class={[
				'flex items-center gap-x-2',
				'not-first:mt-4',
				{ '!mt-0': !(category === undefined || (category && parameter_.category === category)) }
			]}
		>
			{#if category === undefined || (category && parameter_.category === category)}
				<!-- Drag handle area -->
				<div role="button" tabindex="0" class="cursor-grab rounded-xl p-1 hover:bg-gray-100">
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
				<div class="w-full rounded-xl bg-gray-100 px-2 py-4" aria-label="List of exam parameters">
					<div class="grid grid-cols-2 items-start gap-4">
						<Input
							bind:value={$form.parameters[index_].name}
							name={`parameter-${index_}-name${category ? `-${category}` : ''}`}
							label="Nombre del parámetro"
							placeholder="Nombre del parámetro"
							autoComplete={false}
							error={$errors?.parameters?.[index_]?.name}
						/>

						<Input
							bind:value={
								() => $form.parameters[index_].unit ?? '',
								(v) => ($form.parameters[index_].unit = v === '' ? undefined : v)
							}
							name="unit"
							label="Unidad del parámetro"
							placeholder="Unidad del parámetro"
							autoComplete={false}
							error={$errors?.parameters?.[index_]?.unit as string | string[] | undefined}
						/>

						<Checkbox
							bind:value={
								() => $form.parameters[index_].hasReferences,
								(v) => {
									if (v) {
										$form.parameters[index_].referenceValues = [''];
									} else {
										$form.parameters[index_].referenceValues = [];

										if ($errors?.parameters?.[index_]?.referenceValues) {
											$errors.parameters[index_].referenceValues = undefined;
										}
									}
									$form.parameters[index_].hasReferences = v;
								}
							}
							text="Añadir valores de referencia"
							wrapperClass="!ml-0 !text-base"
						/>
					</div>

					{#if $form.parameters[index_].hasReferences}
						<div class="mt-2 flex flex-col gap-y-1">
							<p class="ml-2 font-semibold">Valores de referencia</p>
							{#each $form.parameters[index_].referenceValues as _, j_index (j_index)}
								<div class="flex gap-x-2">
									<Input
										wrapperClass="w-7/8"
										bind:value={$form.parameters[index_].referenceValues[j_index]}
										name={`parameter-${index_}-name-CATEGORY}`}
										placeholder="Valor de referencia"
										autoComplete={false}
										error={$errors?.parameters?.[index_]?.referenceValues?.[j_index]}
									/>

									<Button
										class="!bg-inherit !p-0"
										title="Eliminar valor de referencia"
										onclick={() => {
											removeRefValue(index_, j_index);
										}}
									>
										<Icon src={X} size="22" class="text-red-400 hover:text-red-600" />
									</Button>
								</div>
							{/each}

							<Button
								onclick={() => addRefValue(index_)}
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
						removeParameter(index_);
					}}
					class="!bg-inherit !p-0"
				>
					<Icon src={CircleMinus} size="32" theme="filled" class="text-red-500" />
				</Button>
			{/if}
		</div>
	{/each}
</div>

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
