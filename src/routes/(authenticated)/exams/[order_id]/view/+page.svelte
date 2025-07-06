<script lang="ts">
	import { page } from '$app/state';
	import { formatDateDMY, getAgeFromDate } from '$lib/client';
	import { generatePDF } from '$lib/client/pdfGenerator';
	import Button from '$lib/components/Button.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Download, Send2 } from '@steeze-ui/tabler-icons';
	import { goto } from '$app/navigation';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let {
		orderData: { exams: examsData, patient, orderExamTypes: examTypes, ...orderData }
	} = data;

	// TODO: Get this from the Configuration
	const orgFullName = 'Laboratorio Clínico Marsal C.A';
	const orgRif = 'J-30197029-2';
	const orgAddress = 'Urbanizacion Los Guaritos III, Av.1, Calle N° 7 Maturín, Monagas';
	const orgPhones = '0424-9188205';
	const orgEmail = 'roccajess@gmail.com';

	async function callGeneratePDF() {
		downloading = true;

		// Collect all pages before generation
		collectPages();

		const success = await generatePDF(pageElements);

		downloading = false;

		return success;
	}

	let downloading = $state(false);
	let action = $state(page.url.searchParams.get('action'));
	let pageElements = $state<HTMLElement[]>([]);

	// Function to collect all page elements
	function collectPages() {
		const container = document.querySelector('#pdf-pages-container');
		if (container) {
			// pageElements = Array.from(container.children) as HTMLElement[];

			pageElements = Array.from(container.children).filter(
				(el) => el.tagName === 'DIV'
			) as HTMLElement[];
		}
	}

	$effect(() => {
		if (action == 'download') {
			const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
			delay(500).then(() => {
				console.log('after wait');
				callGeneratePDF().then((success) => {
					if (success) {
						action = null;
						const url = page.url;
						url.searchParams.delete('action');
						goto(url);
					}
				});
			});
		}
	});
</script>

<div class="w-full flex-col">
	<div
		class="direct-children:w-1/4 direct-children:justify-center mt-4 mb-2 inline-flex w-full justify-center gap-x-8"
	>
		<Button
			class="!bg-dark-blue hover:!bg-dark-blue/75 inline-flex items-center gap-x-1"
			onclick={async () => await callGeneratePDF()}
			disabled={downloading}
		>
			<span>Descargar</span>

			<span>
				<Icon src={Download} size="24" />
			</span>
		</Button>

		<!-- TODO: Implementar logica para enviar los reusltados al correo del usuario si tiene uno asociado -->
		<Button
			class="!bg-primary-green hover:!bg-primary-green/75 inline-flex items-center gap-x-1"
			disabled={!patient.email}
			title={patient.email
				? 'Enviar resultados por correo electrónico'
				: 'El paciente no tiene correo electrónico asociado'}
			onclick={() =>
				alert('Enviar resultados al correo del paciente - Funcionalidad no implementada')}
		>
			<span>Enviar</span>

			<span>
				<Icon src={Send2} size="24" />
			</span>
		</Button>
	</div>

	<hr class="mx-auto mb-6 w-18/20 border-gray-300" />

	<div id="pdf-pages-container" class="w-full">
		{#each examsData as exam}
			{@const { results, sample } = exam}
			{@const examHasReferences = results.some((r_) => r_.parameterSnapshot.hasReferences)}
			{@const examType = examTypes.find((elem_) => elem_.id === exam.examTypeId)!}

			<div class="w-full space-y-4 !p-0">
				<div class="w-full space-y-4 bg-white !px-8 !pt-8 !pb-16">
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
						<p class="text-center font-['Cambria'] text-xl uppercase">
							{examType.classification.name}
						</p>
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
							{#each results as result_ (result_.id)}
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
			</div>

			<hr class="mx-auto mb-6 w-18/20 border-gray-300" />
			<hr class="mx-auto mb-6 w-18/20 border-gray-300" />
		{/each}
	</div>
</div>
