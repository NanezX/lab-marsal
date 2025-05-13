<script lang="ts">
	import type { PageProps } from './$types';
	import Button from '$lib/components/Button.svelte';
	import { fade } from 'svelte/transition';
	import { sortArrayObject } from '$lib/shared/utils';

	let { data }: PageProps = $props();

	let { examTypeData } = data;
</script>

<div in:fade class="mb-4 flex w-full flex-col gap-y-8">
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
			<Button class="w-fit" onclick={() => console.log(examTypeData)}>xdd</Button>
		</div>

		<hr class="border-primary-gray/50 my-4" />

		<div class="space-y-5">
			<p class="text-2xl">Valores y parámetros</p>

			<div class="flex flex-col gap-y-4">
				{#if examTypeData.categories.length > 0}
					{#each examTypeData.categories as category_}
						<div class="rounded-xl bg-gray-100 px-2 py-4">
							<p class="font-bold">{category_}</p>
							{#each sortArrayObject( examTypeData.parameters.filter((p_) => p_.category == category_), 'position' ) as parameter_}
								{#if parameter_.hasReferences}
									<div class="ml-6 grid grid-cols-3">
										<p>
											{parameter_.name}
										</p>
										<div>
											{#each parameter_.referenceValues as reference_}
												<p>{reference_}</p>
											{/each}
										</div>
									</div>
								{:else}
									<p>
										{parameter_.name}
									</p>
								{/if}
							{/each}
						</div>
					{/each}
				{:else}
					{#each sortArrayObject(examTypeData.parameters, 'position') as parameter_}
						<div class="grid grid-cols-3 rounded-xl bg-gray-100 px-2 py-4">
							{#if parameter_.hasReferences}
								<p>
									{parameter_.name}
								</p>
								<div>
									{#each parameter_.referenceValues as reference_}
										<p>{reference_}</p>
									{/each}
								</div>
							{:else}
								<p>
									{parameter_.name}
								</p>
							{/if}
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>
</div>
