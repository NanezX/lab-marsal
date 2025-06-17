<script lang="ts">
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import Input from '$lib/components/Input.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Button from '$lib/components/Button.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { CircleMinus, TextPlus, X } from '@steeze-ui/tabler-icons';
	import AddButton from '$lib/components/buttons/AddButton.svelte';
	import type { SuperFormData, SuperFormErrors } from 'sveltekit-superforms/client';
	import { deleteAndReindex } from '$lib/shared/utils';
	import type { ExamTypeSchema } from '$lib/server/utils/zod';
	import autoAnimate from '@formkit/auto-animate';
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

	let { form, errors, category, addParameter, removeParameterCallback }: PropType = $props();

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
				// Reorganize parameter items
				[$form.parameters[draggingItemIndex], $form.parameters[hoveredItemIndex]] = [
					$form.parameters[hoveredItemIndex],
					$form.parameters[draggingItemIndex]
				];

				const aux = $form.parameters[draggingItemIndex].position;
				$form.parameters[draggingItemIndex].position = $form.parameters[hoveredItemIndex].position;
				$form.parameters[hoveredItemIndex].position = aux;

				// Reorganize error items
				if ($errors.parameters) {
					[$errors.parameters[draggingItemIndex], $errors.parameters[hoveredItemIndex]] = [
						$errors.parameters[hoveredItemIndex],
						$errors.parameters[draggingItemIndex]
					];
				}

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

	import { flip } from 'svelte/animate';
	import { clone } from 'lodash-es';
	const flipDurationMs = 300;

	let items = $state(
		$form.parameters.map((p) => {
			return clone({ id: uuidv4(), ...p });
		})
	);

	function handleDndConsider(e: CustomEvent<DndEvent<(typeof items)[0]>>) {
		items = e.detail.items;
	}

	function handleDndFinalize(e: CustomEvent<DndEvent<(typeof items)[0]>>) {
		const itemIndex = items.findIndex((item_) => item_.id === e.detail.info.id);

		form.update(($form) => {
			const paramIndex = $form.parameters.findIndex(
				(param_) => param_.position === items[itemIndex].position
			);

			// Reorganize parameter items
			[$form.parameters[itemIndex], $form.parameters[paramIndex]] = [
				$form.parameters[paramIndex],
				$form.parameters[itemIndex]
			];

			const aux = $form.parameters[itemIndex].position;
			$form.parameters[itemIndex].position = $form.parameters[paramIndex].position;
			$form.parameters[paramIndex].position = aux;

			// Reorganize error items
			if ($errors.parameters) {
				[$errors.parameters[itemIndex], $errors.parameters[paramIndex]] = [
					$errors.parameters[paramIndex],
					$errors.parameters[itemIndex]
				];
			}

			return $form;
		});

		items = e.detail.items;
	}
</script>

<!-- To control when the drag ends outside of th drag container -->
<!-- <svelte:window ondragover={windowOnDragOver} /> -->

<!-- use:autoAnimate -->
<section
	class="space-y-4"
	use:dndzone={{ items, flipDurationMs }}
	onconsider={handleDndConsider}
	onfinalize={handleDndFinalize}
>
	{#each items as parameter_ (parameter_.id)}
		<!-- Handle rendering:
     - If no `category` prop is passed, all the parameters will be render
     - If a `category` prop is passed, only the parameters with the same category will be rendered
    -->
		<!-- <div animate:flip class="flex items-center gap-x-2"> -->
		<div animate:flip={{ duration: flipDurationMs }}>
			<!-- {#if category === undefined || (category && $form.parameters[index].category === category)} -->
			<p>{parameter_.name}</p>
			<!-- {/if} -->
		</div>
	{/each}
</section>

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

<style>
	section {
		width: 50%;
		padding: 0.3em;
		border: 1px solid black;
		overflow: scroll;
		height: 120px;
	}
	div {
		width: 50%;
		padding: 0.2em;
		border: 1px solid blue;
		margin: 0.15em 0;
	}
</style>
