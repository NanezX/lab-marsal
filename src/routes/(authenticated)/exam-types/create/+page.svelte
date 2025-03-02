<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Textarea from '$lib/components/Textarea.svelte';
	import { fade } from 'svelte/transition';
	import type { ExamParemeterInput } from './params';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Cancel, Check, CirclePlus, CopyPlus, PencilMinus } from '@steeze-ui/tabler-icons';
	import ModalEditCategory from '$lib/components/modal/ModalEditCategory.svelte';
	import { superForm } from 'sveltekit-superforms';
	import ParametersCompo from './ParametersCompo.svelte';
	import { generateName } from '$lib/shared/utils';
	import { tick } from 'svelte';

	let { data } = $props();

	const { form, errors, enhance } = superForm(data.examTypeForm, {
		dataType: 'json'
	});

	async function addParameter(category?: string): Promise<void> {
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

		const newIndex = $form.parameters.length;

		form.update(($form) => {
			$form.parameters.push({
				position: newIndex,
				parameter: { ...initParameter, category }
			});
			return $form;
		});

		// Wait for DOM update
		await tick();

		// Go to element parameter
		gotoElementBySelector(`[data-param-index="${newIndex}"]`);
	}

	function addCategory() {
		const newCategory = generateName('Categoria', $form.categories.length + 1, (v) =>
			$form.categories.includes(v)
		);

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
		form.update(($form) => {
			const newParams = $form.parameters.filter((param_) => param_.parameter.category !== category);
			$form.parameters = newParams;
			$form.categories.splice(categoryIndex, 1);

			if (newParams.length == 0) {
				addParameter();
			}

			return $form;
		});
	}

	function gotoElementBySelector(selector: string) {
		const newElement = document.querySelector(selector);
		newElement?.scrollIntoView({
			behavior: 'smooth',
			block: 'center',
			inline: 'center'
		});
	}

	let isEditingCategory = $state(false);
	let editingCategoryIndex: null | number = $state(null);

	let categoriesStatus: { [key: number]: string } = $state({});

	function editCategory(categoryIndex_: number) {
		categoriesStatus[categoryIndex_] = $form.categories[categoryIndex_];
	}

	function finishEditCategory(categoryIndex_: number) {
		delete categoriesStatus[categoryIndex_];
	}

	function saveEditCategory(categoryIndex_: number) {
		form.update(($form) => {
			// Rename the category of each parameter to the new one
			$form.parameters.forEach((param_) => {
				if (param_.parameter.category === $form.categories[categoryIndex_]) {
					param_.parameter.category = categoriesStatus[categoryIndex_];
				}
			});

			// Rename the category to the new one
			$form.categories[categoryIndex_] = categoriesStatus[categoryIndex_];
			return $form;
		});

		finishEditCategory(categoryIndex_);
	}
</script>

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
						error={$errors.name}
					/>

					<Input
						bind:value={$form.basePrice}
						type="number"
						name="basePrice"
						step="0.01"
						label="Precio base (USD)"
						placeholder="Precio base referencia"
						wrapperClass="w-1/2"
						error={$errors.basePrice}
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

			{#each $form.categories as category, categoryIndex (categoryIndex)}
				<div class="space-y-4 rounded-lg border border-gray-200 p-1">
					<div class="inline-flex w-full items-center justify-center gap-x-4">
						<div class="inline-flex gap-x-1">
							{#if categoriesStatus[categoryIndex]}
								<Input
									wrapperClass="w-2/3"
									bind:value={categoriesStatus[categoryIndex]}
									name="any"
								/>

								<Button
									class="mr-2 !bg-inherit !p-0"
									title="Guardar"
									onclick={() => saveEditCategory(categoryIndex)}
								>
									<Icon src={Check} size="20" theme="filled" class="text-green-500" />
								</Button>

								<Button
									class="mr-2 !bg-inherit !p-0"
									title="Cancelar"
									onclick={() => finishEditCategory(categoryIndex)}
								>
									<Icon src={Cancel} size="20" theme="filled" class="text-red-500" />
								</Button>
							{:else}
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
							{/if}
						</div>

						<Button
							onclick={() => removeCategory(category, categoryIndex)}
							class="!p0 !bg-red-500 !px-2 text-sm"
							title="Eliminar esta categoria"
						>
							<p>Eliminar</p>
						</Button>
					</div>

					<ParametersCompo {form} {errors} {category} {addParameter} />
				</div>
			{:else}
				<ParametersCompo {form} {errors} />
			{/each}
		</div>
	</div>
</form>
