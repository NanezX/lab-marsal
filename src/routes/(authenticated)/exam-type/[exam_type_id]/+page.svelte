<script lang="ts">
	import type { PageProps } from './$types';
	import { fade } from 'svelte/transition';
	import { sortArrayObject } from '$lib/shared/utils';
	import DisplayExamTypeParams from '$lib/components/DisplayExamTypeParams.svelte';
	import Link from '$lib/components/Link.svelte';
	import BackButton from '$lib/components/buttons/BackButton.svelte';
	import Button from '$lib/components/Button.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { showToast } from '$lib/toasts';
	import { goto } from '$app/navigation';
	import ConfirmModal from '$lib/components/modal/ConfirmModal.svelte';

	// TODO: Verify AND check what roles can remove/delete an exam type

	let { data }: PageProps = $props();
	let { examTypeData, deleteExamTypeForm } = data;

	const {
		form,
		errors,
		enhance,
		submit: submitDeleteExamType
	} = superForm(deleteExamTypeForm, {
		dataType: 'json',
		delayMs: 0,
		applyAction: true,
		onUpdated({ form }) {
			// Display message based on the response
			if (form.message) {
				showToast(form.message.text, form.message.type);

				if (form.message.type == 'success') {
					goto(`/exam-types`);
				}
			}
		}
	});

	let showConfirmDeleteModal = $state(false);
</script>

<ConfirmModal
	bind:showModal={showConfirmDeleteModal}
	title="Eliminar exámen"
	text="¿Estás seguro de eliminar este exámen?"
	secondaryText="Esto eliminará los exámenes ya creados con este tipo de exámen."
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
				title="Crear nuevo exámen"
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

			<div class="grid grid-cols-2 gap-2">
				<p>
					<strong> Precio: </strong>
					<span>{examTypeData.basePrice} $</span>
				</p>

				<p>
					<strong>Creado: </strong>
					<span>{examTypeData.createdAt.toLocaleString()}</span>
				</p>

				{#if examTypeData.createdAt.getTime() == examTypeData.updatedAt.getTime()}
					<p class="col-start-2">
						<strong>Última vez actualizado: </strong>
						<span>{examTypeData.updatedAt.toLocaleString()}</span>
					</p>
				{/if}
			</div>

			<p>
				<strong>Descripción: </strong><br />
				<span>{examTypeData.description}</span>
			</p>
		</div>

		<hr class="border-primary-gray/50 my-4" />

		<div class="space-y-5">
			<p class="text-2xl">Valores y parámetros</p>

			<div class="flex flex-col gap-y-4">
				{#if examTypeData.categories.length > 0}
					{#each examTypeData.categories as category_}
						<div class="rounded-xl bg-gray-100 px-2 py-4">
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
					<div class="rounded-xl bg-gray-100 p-4">
						<DisplayExamTypeParams params={sortArrayObject(examTypeData.parameters, 'position')} />
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
