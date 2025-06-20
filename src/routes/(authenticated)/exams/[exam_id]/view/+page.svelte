<script lang="ts">
	import { page } from '$app/state';
	import { formatDateDMY, getAgeFromDate } from '$lib/client';
	import { generatePDF } from '$lib/client/pdfGenerator';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let {
		examData: { results, sample, examType, patient }
	} = data;

	// TODO: Get this from the Configuration
	const orgFullName = 'Laboratorio Clínico Marsal C.A';
	const orgRif = 'J-30197029-2';
	const orgAddress = 'Urbanizacion Los Guaritos III, Calle N° 7 Maturín, Monagas';
	const orgPhones = '0424-9188205';
	const orgEmail = 'roccajess@gmail.com';

	const examHasReferences = results.some((r_) => r_.parameterSnapshot.hasReferences);

	async function callGeneratePDF() {
		return await generatePDF(element);
	}

	let action = $state(page.url.searchParams.get('action'));
	let element = $state<HTMLElement | null>(null);

	$effect(() => {
		if (action == 'download') {
			callGeneratePDF().then((success) => {
				if (success) {
					action = null;
					const url = page.url;
					url.searchParams.delete('action');

					setTimeout(() => {
						window.close();
					}, 100);
				}
			});
		}
	});
</script>

<div bind:this={element} class="mx-auto w-full space-y-4 bg-white !px-8 !pt-8 !pb-16">
	<!-- Membrete -->
	<div class="space-y-6">
		<div class="ml-4 inline-flex items-end gap-x-3">
			<img alt="El logo de MarsalLab" src="/favicon.png" width="50" height="50" />
			<p class="font-['Arial'] leading-none font-semibold uppercase">
				<span>
					{orgFullName}
				</span>

				<span class="ml-2 text-xs font-bold">
					RIF. {orgRif}
				</span>
			</p>
		</div>
		<div class="ml-6 flex justify-between">
			<div class="w-1/2 space-y-3 font-['Cambria'] text-xs font-semibold">
				<p class="uppercase">{orgAddress}</p>

				<p class="uppercase">
					<span>
						Telefonos: {orgPhones}
					</span>
					<span class="ml-2">E-MAIL: {orgEmail}</span>
				</p>
			</div>

			<div class="max-w-1/2">
				<div class="direct-children:mt-[-2px] grid grid-cols-2 gap-x-4 font-['Cambria']">
					<span class="!mt-0 text-end">Nombre: </span>
					<span class="!mt-0">{patient.firstName} {patient.lastName}</span>

					<span class="text-end">Cédula:</span>
					<span>{patient.documentId ?? ''}</span>

					<span class="text-end">Edad: </span>
					<span>{getAgeFromDate(patient.birthdate)}</span>

					<span class="text-end">Fecha: </span>
					<span>{formatDateDMY(new Date())}</span>
				</div>
			</div>
		</div>
	</div>

	{#if examType.classification.name !== 'Sin clasificación'}
		<p class="text-center font-['Cambria'] text-xl uppercase">{examType.classification.name}</p>
	{/if}

	<hr class="mb-6 border-black/50" />

	<p class="text-center font-['Cambria'] text-xl uppercase underline">{examType.name}</p>

	{#if sample}
		<p class="-mt-1 text-center font-['Cambria'] text-xl uppercase">
			<span class="underline">Muestra: </span>
			<span class="capitalize">{sample}</span>
		</p>
	{/if}

	<table
		class={[
			"mt-4 font-['Cambria'] text-lg",
			{ 'w-full': examHasReferences, 'mx-auto w-1/2': !examHasReferences }
		]}
	>
		<thead>
			<tr class="direct-children:pb-2 direct-children:uppercase direct-children:font-[600]">
				<th scope="col"> Análisis </th>
				<th scope="col"> Resultado </th>

				{#if examHasReferences}
					<th scope="col"> Valores de Referencia </th>
				{/if}
			</tr>
		</thead>
		<tbody>
			{#each results as result_}
				{@const parameter_ = result_.parameterSnapshot}
				<tr class="direct-children:font-[500]">
					<th scope="row">
						{parameter_.name}
						{#if parameter_.unit}
							({parameter_.unit})
						{/if}
					</th>

					<th scope="row">
						{result_.value}
					</th>

					{#if examHasReferences}
						<!-- TODO: Play with multiple reference value. SHow correctly -->
						<th scope="row">
							{parameter_.referenceValues}
						</th>
					{/if}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
