<script lang="ts">
	import type { PageProps } from './$types';
	import { fade } from 'svelte/transition';
	import { sortArrayObject } from '$lib/shared/utils';
	import DisplayExamTypeParams from '$lib/components/DisplayExamTypeParams.svelte';
	import Link from '$lib/components/Link.svelte';
	import BackButton from '$lib/components/buttons/BackButton.svelte';
	import Button from '$lib/components/Button.svelte';
	import { superForm } from 'sveltekit-superforms';
	import ConfirmModal from '$lib/components/modal/ConfirmModal.svelte';
	import LabelValue from '$lib/components/LabelValue.svelte';
	import { Cash, ClockEdit, ClockPlus, FileDescription, ListTree } from '@steeze-ui/tabler-icons';
	import { Icon } from '@steeze-ui/svelte-icon';

	// TODO: Verify AND check what roles can remove/delete an exam type (maybe just block the page to those user in the backend)

	let { data }: PageProps = $props();
	let { examTypeData, deleteExamTypeForm } = data;

	const { enhance, submit: submitDeleteExamType } = superForm(deleteExamTypeForm, {
		dataType: 'json',
		delayMs: 0,
		applyAction: true
	});

	let showConfirmDeleteModal = $state(false);
</script>

<ConfirmModal
	bind:showModal={showConfirmDeleteModal}
	title="Eliminar exámen"
	text="¿Estás seguro de eliminar este exámen?"
	secondaryText="Esto eliminará los exámenes ya creados con este tipo de exámen. El nombre de este tipo de exámen no podrá ser utilizado nuevamente."
	saveButtonText="Eliminar"
	cancelButtonText="Cancelar"
	onSave={() => {
		submitDeleteExamType();
		return true;
	}}
/>

<div in:fade class="mb-4 flex w-full flex-col gap-y-8">
	<form use:enhance method="POST" hidden></form>

	<div class="relative flex justify-center">
		<BackButton href="/exam-types" size="40" />

		<p class="mx-auto my-0 text-center text-3xl">{examTypeData.name}</p>

		<div>
			<Link
				href="/exam-type/{examTypeData.id}/edit"
				title="Editar tipo de exámen"
				class="!bg-green-400 hover:!bg-green-500">Editar</Link
			>

			<Button
				type="button"
				onclick={() => (showConfirmDeleteModal = !showConfirmDeleteModal)}
				class="bg-red-400 hover:bg-red-500">Eliminar</Button
			>
		</div>
	</div>

	<div>
		<div class="space-y-5">
			<p class="text-2xl">Detalles generales</p>

			<div class="grid grid-cols-2 gap-x-4 gap-y-3">
				<!-- class="mt-2 flex items-center gap-x-1" -->
				<LabelValue label="Precio" value={`${examTypeData.basePrice} $`} icon={Cash} />

				<LabelValue
					label="Clasificación"
					value={examTypeData.classification.name}
					icon={ListTree}
				/>

				<LabelValue
					label="Creado"
					value={examTypeData.createdAt.toLocaleString()}
					icon={ClockPlus}
				/>

				{#if examTypeData.createdAt.getTime() !== examTypeData.updatedAt.getTime()}
					<LabelValue
						label="Último cambio"
						value={examTypeData.updatedAt.toLocaleString()}
						icon={ClockEdit}
					/>
				{/if}

				<p class="col-span-full flex flex-col gap-y-2" title="Descripción del tipo de exámen">
					<span class="flex items-center gap-x-1">
						<Icon src={FileDescription} class="h-5 w-5" />
						<strong>Descripción: </strong><br />
					</span>

					<span
						class="ml-2 max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-gray-100 px-2 py-4 whitespace-pre-line"
					>
						{examTypeData.description ?? 'Sin descripción'}
					</span>
				</p>
			</div>
		</div>

		<hr class="border-primary-gray/50 my-4" />

		<div class="space-y-5">
			<p class="text-2xl">Valores y parámetros</p>

			<div class="flex flex-col gap-y-4">
				{#if examTypeData.categories.length > 0}
					{#each examTypeData.categories as category_}
						<div class="rounded-xl border border-gray-200 bg-gray-100 px-2 py-4">
							<p class="text-lg font-bold">{category_}</p>

							<DisplayExamTypeParams
								class="ml-6"
								params={sortArrayObject(
									examTypeData.parameters.filter((p_) => p_.category == category_),
									'position'
								)}
							/>
						</div>
					{/each}
				{:else}
					<div class="rounded-xl border border-gray-200 bg-gray-100 px-2 py-4">
						<DisplayExamTypeParams params={sortArrayObject(examTypeData.parameters, 'position')} />
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
