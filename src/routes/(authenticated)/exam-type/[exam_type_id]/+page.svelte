<script lang="ts">
	import type { PageProps } from './$types';
	import Button from '$lib/components/Button.svelte';
	import { fade } from 'svelte/transition';
	import { sortArrayObject } from '$lib/shared/utils';
	import DisplayExamTypeParams from '$lib/components/DisplayExamTypeParams.svelte';
	import { generatePDF } from '$lib/client';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { PencilMinus } from '@steeze-ui/tabler-icons';

	let { data }: PageProps = $props();

	let { examTypeData } = data;
</script>

<!-- TODO: Add button to edit the exam type -->
<div in:fade class="mb-4 flex w-full flex-col gap-y-8">
	<div class="relative flex justify-center">
		<p class="mx-auto my-0 text-center text-3xl">{examTypeData.name}</p>

		<Button
			class="mr-2 !bg-green-400 hover:!bg-green-500"
			title="Editar tipo de exámen"
			onclick={() => {
				console.log(examTypeData);
				alert('Editar tipo de examen');
			}}
		>
			Editar
		</Button>
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
