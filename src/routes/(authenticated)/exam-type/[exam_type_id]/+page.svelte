<script lang="ts">
	import type { PageProps } from './$types';
	// import Button from '$lib/components/Button.svelte';
	import { fade } from 'svelte/transition';
	import { sortArrayObject } from '$lib/shared/utils';
	import DisplayExamTypeParams from '$lib/components/DisplayExamTypeParams.svelte';

	let { data }: PageProps = $props();

	let { examTypeData } = data;

	async function generatePDF() {
		const targetId = 'probando';

		try {
			const element = document.getElementById(targetId);
			if (!element) throw new Error('Target element not found');

			const response = await fetch('/api/generate-pdf', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					html: element.outerHTML // 💡 full element, not just inner
					// optionally: styles: customStylesHere
				})
			});

			if (!response.ok) throw new Error('PDF generation failed');

			const blob = await response.blob();
			const url = URL.createObjectURL(blob);

			const a = document.createElement('a');
			a.href = url;
			a.download = 'document.pdf';
			a.click();

			URL.revokeObjectURL(url);
		} catch (e) {
			console.error('PDF generation error:', e);
		}
	}
</script>

<button
	onclick={generatePDF}
	class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
>
	Download PDF
</button>

<!-- TODO: Add button to edit the exam type -->
<div in:fade class="mb-4 flex w-full flex-col gap-y-8" id="probando">
	<p class="text-center text-3xl">{examTypeData.name}</p>

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
								).concat(
									sortArrayObject(
										examTypeData.parameters.filter((p_) => p_.category == category_),
										'position'
									)
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
