<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Textarea from '$lib/components/Textarea.svelte';
	import { fade } from 'svelte/transition';
	import type { ExamParemeterInput, ParameterData } from './params';
	import AddButton from '$lib/components/buttons/AddButton.svelte';
	import { flip } from 'svelte/animate';
	import { Icon } from '@steeze-ui/svelte-icon';
	import {
		CirclePlus,
		CopyPlus,
		CircleMinus,
		PencilMinus,
		X,
		Edit,
		TextPlus
	} from '@steeze-ui/tabler-icons';
	import { v4 as uuidv4 } from 'uuid';
	import ModalEditCategory from '$lib/components/modal/ModalEditCategory.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import ModalEditArrayItem from '$lib/components/modal/ModalEditArrayItem.svelte';

	let examName = $state('');
	let examDescription = $state('');
	let basePrice = $state('');

	let categories: string[] = $state([]);

	const initParameter: ExamParemeterInput = {
		name: '',
		type: 'text', // | "number";
		category: undefined,
		unit: '',
		value: '', // | number
		hasReferences: true,
		referenceValues: ['Valor 1', 'Valor 2']
		// hasReferences: false,
		// referenceValues: []
	};

	let baseParameters: ParameterData[] = $state([{ position: 0, parameter: initParameter }]);

	function addParameter(category?: string): void {
		// Fallback if there are categories items and no category passed to the function
		if (categories.length > 0 && category === undefined) {
			category = categories[0];
		}

		const newParam = { ...initParameter, category };

		baseParameters.push({ position: baseParameters.length, parameter: newParam });
	}

	function removeParameter(parameters: ParameterData[], innerIndex: number) {
		if (parameters.length > 1) {
			const indexToRemove = baseParameters.findIndex(
				(x) => x.position === parameters[innerIndex].position
			);

			if (indexToRemove != -1) {
				baseParameters.splice(indexToRemove, 1);
			}
		}
	}

	function addCategory() {
		function generateName(baseNumber: number) {
			const newCategory = `Categoria ${baseNumber}`;

			if (categories.includes(newCategory)) {
				// If this name already exist, create a diffrent one
				return generateName(baseNumber + 1);
			}

			// End recursivity
			return newCategory;
		}

		const newCategory = generateName(categories.length + 1);
		const newParam = { ...initParameter, category: newCategory };

		if (categories.length == 0 && baseParameters.length > 0) {
			// Since there was no category created, assign each parameter to the new one
			baseParameters.forEach((param_) => {
				param_.parameter.category = newCategory;
			});
		} else {
			// Always create new categories with one parameter
			baseParameters.push({ position: baseParameters.length, parameter: newParam });
		}

		categories.push(newCategory);
	}

	function removeCategory(category: string, categoryIndex: number) {
		const newParams = baseParameters.filter((param_) => param_.parameter.category !== category);
		baseParameters = newParams;
		categories.splice(categoryIndex, 1);
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
			[baseParameters[draggingItemIndex], baseParameters[hoveredItemIndex]] = [
				baseParameters[hoveredItemIndex],
				baseParameters[draggingItemIndex]
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

	let isEditingRefValue = $state(false);
	let auxRefValues: string[] = $state([]);
	let auxRefValueIndex: number | null = $state(null);

	function editRefValue(refValues: string[], index: number) {
		isEditingRefValue = true;
		auxRefValues = refValues;
		auxRefValueIndex = index;
	}

	function removeRefValue(refValues: string[], index: number) {
		if (refValues.length > 1 && index >= 0 && refValues.length > index) {
			refValues.splice(index, 1);
		}
	}

	$inspect(isEditingRefValue);
</script>

<!-- TODO: Add the labels above the inputs -->

<!-- To control when the drag ends outside of th drag container -->
<svelte:window ondragover={windowOnDragOver} />

<!-- Snippet for generating the params inputs -->
{#snippet parameters(parameters: ParameterData[], category?: string)}
	{#each parameters as param, index (param)}
		<div
			class="flex items-center gap-x-2"
			transition:fade
			animate:flip={{ duration: 500 }}
			id={index.toString()}
		>
			<!-- Drag handle area -->
			<div
				role="button"
				tabindex="0"
				aria-label="Drag handle for parameter {param.position}"
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
					<Input bind:value={param.parameter.name} name="name" placeholder="Nombre del parámetro" />
					<Input bind:value={param.parameter.unit} name="unit" placeholder="Unidad del parámetro" />

					<Checkbox
						bind:value={
							() => param.parameter.hasReferences,
							(v) => {
								if (v) param.parameter.referenceValues = ['Valor de referencia'];
								param.parameter.hasReferences = v;
							}
						}
						text="Añadir valores de referencia"
						wrapperClass="!ml-0 !text-base"
					/>
					{#if param.parameter.hasReferences}
						<div transition:fade class="flex flex-col gap-y-1">
							{#each param.parameter.referenceValues as refValue, index (uuidv4())}
								<div class="flex gap-x-2">
									<p class="bg-secondary-blue/30 w-7/8 rounded-3xl px-3 py-1.5">
										{refValue}
									</p>
									<Button
										class="!bg-inherit !p-0"
										title="Editar valor de referencia"
										onclick={() => {
											editRefValue(param.parameter.referenceValues, index);
										}}
									>
										<Icon src={Edit} size="22" class="text-green-400 hover:text-green-600" />
									</Button>
									<Button
										class="!bg-inherit !p-0"
										title="Eliminar valor de referencia"
										onclick={() => {
											removeRefValue(param.parameter.referenceValues, index);
										}}
									>
										<Icon src={X} size="22" class="text-red-400 hover:text-red-600" />
									</Button>
								</div>
							{/each}

							<Button
								onclick={() => alert('add ref')}
								title="Añadir nuevo valor de referencia"
								class="not-hover:text-primary-blue hover:text-dark-blue mx-auto mt-1 flex gap-x-1 !bg-inherit !p-0"
							>
								<p class="hover:underline">Añadir</p>
								<Icon src={TextPlus} size="24" class="" />
							</Button>
						</div>
					{/if}
				</div>
			</div>

			<Button
				onclick={() => {
					removeParameter(parameters, index);
				}}
				class="!bg-inherit !p-0"
			>
				<Icon src={CircleMinus} size="32" theme="filled" class="text-red-500" />
			</Button>
		</div>
	{/each}

	{#if category}
		<div class="text-center">
			<AddButton title="Añadir parámetro" onclick={() => addParameter(category)} />
		</div>
	{/if}
{/snippet}

<!-- Modal to edit the category name -->
{#if editingCategoryIndex !== null}
	<ModalEditCategory
		bind:showModal={isEditingCategory}
		bind:categories
		bind:editingIndex={editingCategoryIndex}
		bind:baseParameters
	/>
{/if}

<!-- Modal to edit a specific value reference -->
{#if auxRefValueIndex !== null}
	<ModalEditArrayItem
		bind:showModal={isEditingRefValue}
		bind:items={auxRefValues}
		bind:editingIndex={auxRefValueIndex}
	/>
{/if}

<!-- ACTUAL PAGE -->
<div in:fade class="mb-4 flex w-full flex-col gap-y-8">
	<p class="text-center text-3xl">Crear tipo de exámen</p>

	<Button
		onclick={() => {
			console.log($state.snapshot(categories));
			console.log($state.snapshot(baseParameters));
		}}>Click to see</Button
	>

	<div>
		<div class="space-y-5">
			<p class="text-2xl">Detalles generales</p>

			<div class="space-y-4">
				<div class="flex gap-x-8">
					<Input
						bind:value={examName}
						name="name"
						placeholder="Nombre del exámen"
						wrapperClass="w-1/2"
					/>

					<Input
						value={basePrice}
						name="basePrice"
						placeholder="Precio base referencia"
						wrapperClass="w-1/2"
					/>
				</div>
				<Textarea
					bind:value={examDescription}
					name="description"
					placeholder="Description del exámen"
				/>
			</div>
		</div>

		<hr class="border-primary-gray/50 my-4" />

		<div class="space-y-5">
			<p class="text-2xl">Valores y parámetros</p>

			{#if categories.length == 0}
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
				{#if categories.length}
					<span> Añadir categoria </span>
				{:else}
					<span> Crear categoria </span>
				{/if}
				<Icon src={CopyPlus} size="26" theme="filled" />
			</Button>

			{#each categories as category, categoryIndex (uuidv4())}
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

					{@render parameters(
						baseParameters.filter((x) => x.parameter.category == category),
						category
					)}
				</div>
			{:else}
				{@render parameters(baseParameters)}
			{/each}
		</div>
	</div>
</div>
