<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Textarea from '$lib/components/Textarea.svelte';
	import { fade } from 'svelte/transition';
	import type { ExamParemeterInput } from './params';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { CirclePlus, CopyPlus, PencilMinus } from '@steeze-ui/tabler-icons';
	import { v4 as uuidv4 } from 'uuid';
	import ModalEditCategory from '$lib/components/modal/ModalEditCategory.svelte';
	import { superForm } from 'sveltekit-superforms';
	import ParametersCompo from './ParametersCompo.svelte';

	let { data } = $props();

	const { form, errors, constraints, enhance, delayed } = superForm(data.examTypeForm, {
		dataType: 'json'
	});

	function addParameter(category?: string): void {
		// Base parameter
		const initParameter: ExamParemeterInput = {
			name: '',
			type: 'text', // | "number";
			category: undefined,
			unit: '',
			hasReferences: false,
			referenceValues: []
		};

		// Fallback if there are categories items and no category passed to the function
		if ($form.categories.length > 0 && category === undefined) {
			category = $form.categories[0];
		}

		form.update(($form) => {
			$form.parameters.push({
				position: $form.parameters.length,
				parameter: { ...initParameter, category }
			});
			return $form;
		});
	}

	function addCategory() {
		function generateName(baseNumber: number) {
			const newCategory = `Categoria ${baseNumber}`;

			if ($form.categories.includes(newCategory)) {
				// If this name already exist, create a diffrent one
				return generateName(baseNumber + 1);
			}

			return newCategory;
		}

		const newCategory = generateName($form.categories.length + 1);

		if ($form.categories.length == 0 && $form.parameters.length > 0) {
			// Since there was no category created, assign each parameter to the new one
			form.update(($form) => {
				$form.parameters.forEach((param_) => {
					param_.parameter.category = newCategory;
				});
				return $form;
			});
		} else {
			addParameter(newCategory);
		}

		form.update(($form) => {
			$form.categories.push(newCategory);
			return $form;
		});
	}

	function removeCategory(category: string, categoryIndex: number) {
		// TODO: VERIFIED THIS WORK
		const newParams = $form.parameters.filter((param_) => param_.parameter.category !== category);
		$form.parameters = newParams;
		$form.categories.splice(categoryIndex, 1);
	}

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

	let isEditingCategory = $state(false);
	let editingCategoryIndex: null | number = $state(null);

	function editCategory(categoryIndex_: number) {
		isEditingCategory = true;
		editingCategoryIndex = categoryIndex_;
	}
</script>

<!-- To control when the drag ends outside of th drag container -->
<svelte:window ondragover={windowOnDragOver} />

<!-- Modal to edit the category name -->
{#if editingCategoryIndex !== null}
	<ModalEditCategory
		bind:showModal={isEditingCategory}
		bind:categories={$form.categories}
		bind:editingIndex={editingCategoryIndex}
		bind:baseParameters={$form.parameters}
	/>
{/if}

<!-- ACTUAL PAGE -->
<form in:fade class="mb-4 flex w-full flex-col gap-y-8" use:enhance method="POST">
	<p class="text-center text-3xl">Crear tipo de exámen</p>

	<Button type="submit">Submit</Button>

	<div>
		<div class="space-y-5">
			<p class="text-2xl">Detalles generales</p>

			<div class="space-y-4">
				<div class="flex gap-x-8">
					<Input
						bind:value={$form.name}
						name="name"
						label="Nombre del exámen"
						placeholder="Nombre del exámen"
						wrapperClass="w-1/2"
					/>

					<Input
						bind:value={$form.basePrice}
						type="number"
						name="basePrice"
						label="Precio base (USD)"
						placeholder="Precio base referencia"
						wrapperClass="w-1/2"
					/>
				</div>

				<div class="flex flex-col gap-y-1">
					<label for="description-textarea" class="ml-2 font-semibold">
						Descripción del exámen
					</label>
					<Textarea
						bind:value={() => $form.description ?? '', (v) => ($form.description = v)}
						name="description"
						placeholder="Description del exámen"
					/>
				</div>
			</div>
		</div>

		<hr class="border-primary-gray/50 my-4" />

		<div class="space-y-5">
			<p class="text-2xl">Valores y parámetros</p>

			{#if $form.categories.length == 0}
				<Button
					onclick={() => addParameter()}
					title="Añadir parámetro nuevo"
					class="inline-flex gap-x-1"
				>
					<span> Añadir parámetro </span>
					<Icon src={CirclePlus} size="26" theme="filled" />
				</Button>
			{/if}

			<!-- Add category button -->
			<Button onclick={addCategory} title="Añadir categoria nuevo" class="inline-flex gap-x-1">
				{#if $form.categories.length}
					<span> Añadir categoria </span>
				{:else}
					<span> Crear categoria </span>
				{/if}
				<Icon src={CopyPlus} size="26" theme="filled" />
			</Button>

			{#each $form.categories as category, categoryIndex (uuidv4())}
				<div
					role="definition"
					class="drag-container space-y-4 rounded-lg border border-gray-200 p-1"
					bind:this={container}
				>
					<div class="inline-flex w-full items-center justify-center gap-x-4">
						<div class="inline-flex gap-x-1">
							<p class="text-lg font-bold">
								{category}
							</p>

							<Button
								class="mr-2 !bg-inherit !p-0"
								title="Editar nombre de la categoria"
								onclick={() => editCategory(categoryIndex)}
							>
								<Icon src={PencilMinus} size="20" theme="filled" class="text-green-500" />
							</Button>
						</div>

						<Button
							onclick={() => removeCategory(category, categoryIndex)}
							class="!p0 !bg-red-500 !px-2 text-sm"
							title="Eliminar esta categoria"
						>
							<p>Eliminar</p>
						</Button>
					</div>

					<ParametersCompo {form} {category} {addParameter} />
				</div>
			{:else}
				<ParametersCompo {form} />
			{/each}
		</div>
	</div>
</form>
