<script lang="ts">
	import type { PageProps } from './$types';
	import { fade } from 'svelte/transition';
	import Link from '$lib/components/Link.svelte';
	import BackButton from '$lib/components/buttons/BackButton.svelte';
	import Button from '$lib/components/Button.svelte';
	import { superForm } from 'sveltekit-superforms';
	import ConfirmModal from '$lib/components/modal/ConfirmModal.svelte';
	import { ExamPriority, ExamStatus, PatientGender } from '$lib/shared/enums';
	import {
		Id,
		GenderMale,
		GenderFemale,
		User,
		Cash,
		ListTree,
		Link as LinkIcon,
		Label,
		TruckDelivery,
		Wallet,
		CodeDots,
		DeviceMobileCog,
		Moneybag,
		ClockPlus,
		ClockEdit,
		Edit,
		Progress,
		Download,
		Eye,
		FileDescription,
		TestPipe2,
		Flag
	} from '@steeze-ui/tabler-icons';
	import LabelValue from '$lib/components/LabelValue.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { paymentMethodLabels } from '$lib/client';
	import { AccordionItem, Accordion } from 'flowbite-svelte';

	// TODO: Verify AND check what roles can remove/delete an exam (maybe just block the page to those user in the backend)

	let { data }: PageProps = $props();

	let {
		orderData: { orderExamTypes, ...orderData },
		// examData: { patient: patientData, examType: examTypeData, ...examData },
		deleteExamForm
	} = data;

	const { enhance, submit: submitDelete } = superForm(deleteExamForm, {
		dataType: 'json',
		delayMs: 0,
		applyAction: true
	});

	// const areResultsReady = examData.results.length > 0;
	let showConfirmDeleteModal = $state(false);

	const priorityLabel = {
		[ExamPriority.High]: 'Alta prioridad',
		[ExamPriority.Normal]: 'Normal',
		[ExamPriority.Low]: 'Baja prioridad'
	};

	const areResultsReady = true;
	// const areResultsReady = orderData.exams.every((exam) => exam.status === ExamStatus.Completed);
</script>

<ConfirmModal
	bind:showModal={showConfirmDeleteModal}
	title="Eliminar exámen"
	text="¿Estás seguro de eliminar este exámen?"
	saveButtonText="Eliminar"
	cancelButtonText="Cancelar"
	onSave={() => {
		submitDelete();
		return true;
	}}
/>

<div in:fade class="mb-4 flex w-full flex-col gap-y-8">
	<form use:enhance method="POST" hidden></form>

	<div class="relative flex justify-center">
		<BackButton href="/exams" size="40" />

		<p class="mx-auto my-0 text-center text-3xl">Orden</p>

		<div>
			<Button
				type="button"
				onclick={() => (showConfirmDeleteModal = !showConfirmDeleteModal)}
				class="bg-red-400 hover:bg-red-500">Eliminar</Button
			>
		</div>
	</div>

	<div>
		<div class="grid grid-cols-2 gap-2">
			<div class="flex flex-col gap-y-1 rounded-xl border border-gray-200 bg-gray-100/75 px-1 py-2">
				<p
					class="mx-auto mb-2 flex w-1/2 items-center justify-center gap-x-1 border-b border-b-gray-300 text-xl font-semibold"
				>
					<span> Detalles </span>

					<Link
						href="/exams/{orderData.id}/edit/details"
						linkClass="flex mt-1"
						class="!text-primary-blue !rounded-full !bg-inherit !p-0 hover:!text-purple-800"
					>
						<Icon
							src={Edit}
							size="24"
							title="Editar detalles del exámen"
							theme="filled"
							class="text-green-500"
						/>
					</Link>
				</p>

				<div class="space-y-0.5 px-1 py-2">
					<LabelValue
						valueClass="capitalize"
						label="Prioridad"
						value={priorityLabel[orderData.priority]}
						icon={Flag}
					/>

					<LabelValue
						label="Entregado"
						value={orderData.deliveredAt ? orderData.deliveredAt.toLocaleString() : 'No entregado'}
						icon={TruckDelivery}
					/>

					<LabelValue
						class={undefined}
						label="Creado"
						value={orderData.createdAt.toLocaleString()}
						icon={ClockPlus}
					/>

					{#if orderData.createdAt.getTime() !== orderData.updatedAt.getTime()}
						<LabelValue
							label="Último cambio"
							value={orderData.updatedAt.toLocaleString()}
							icon={ClockEdit}
						/>
					{/if}
				</div>
			</div>

			<div class="flex flex-col gap-y-1 rounded-xl border border-gray-200 bg-gray-100/75 px-1 py-2">
				<p
					class="mx-auto mb-2 flex w-1/2 items-center justify-center gap-x-1 border-b border-b-gray-300 text-xl font-semibold"
				>
					<span> Detalles de Pago </span>

					<Link
						href="/exams/{orderData.id}/edit/payment"
						linkClass="flex mt-1"
						class="!text-primary-blue !rounded-full !bg-inherit !p-0 hover:!text-purple-800"
					>
						<Icon
							src={Edit}
							size="24"
							title="Editar detalles del pago"
							theme="filled"
							class="text-green-500"
						/>
					</Link>
				</p>
				<LabelValue label="Precio total" value={`${orderData.totalPrice} $`} icon={Cash} />

				<LabelValue
					label="Estado"
					value={orderData.paid ? 'Pago confirmado' : 'No pagado'}
					title={orderData.paid ? 'Pago del exámen confirmado' : 'El exámen no ha sido pagado'}
					icon={Wallet}
				/>

				<LabelValue
					label="Monto pagado"
					value={orderData.paid && orderData.pricePaid ? orderData.pricePaid : 'N/A'}
					title={orderData.paid && orderData.pricePaid
						? 'Monto final cancelado por el exámen'
						: 'El exámen no ha sido pagado'}
					icon={Moneybag}
				/>

				<LabelValue
					label="Método de pago"
					value={orderData.paid && orderData.paymentMethod
						? paymentMethodLabels[orderData.paymentMethod]
						: 'N/A'}
					title={orderData.paid && orderData.paymentMethod
						? 'Método de pago'
						: 'El exámen no ha sido pagado'}
					icon={DeviceMobileCog}
				/>

				{#if orderData.paid && orderData.paymentRef}
					<LabelValue
						label="Ref. del pago"
						value={orderData.paymentRef}
						title="Referencia del pago por el exámen"
						icon={CodeDots}
					/>
				{/if}
			</div>
		</div>

		<div
			class="col-span-2 flex flex-col gap-y-4 rounded-xl border border-gray-200 bg-gray-100/75 px-1 py-2"
		>
			<p
				class="mx-auto mb-2 flex w-1/4 min-w-fit items-center justify-center gap-x-1 border-b border-b-gray-300 text-xl font-semibold"
			>
				<span> Exámenes </span>
			</p>

			<Accordion>
				<!-- Order the exams by the name of the exam type -->
				{#each orderData.exams
					.map( (exam) => ({ exam, examType: orderExamTypes.find((et) => et.id === exam.examTypeId)! }) )
					.sort( (a, b) => a.examType.nameNormalized.localeCompare(b.examType.nameNormalized) ) as { exam, examType }}
					<!-- {@const examType = orderExamTypes.find((element_) => element_.id == exam.examTypeId)!} -->

					<AccordionItem class="cursor-pointer">
						{#snippet header()}
							<p class="font-bold">
								{examType.name}
							</p>
						{/snippet}
						<div class="flex flex-col gap-y-1">
							<LabelValue label="Muestra" value={exam.sample ?? 'N/A'} icon={TestPipe2} />

							<p class="col-span-full flex flex-col gap-y-2" title="Observación del exámen">
								<span class="flex items-center gap-x-1">
									<Icon src={FileDescription} class="h-5 w-5" />
									<strong>Observación: </strong><br />
								</span>

								<span
									class="border-primary-blue/50 mx-2 max-h-60 overflow-y-auto rounded-xl border bg-gray-100 px-2 py-4 whitespace-pre-line first-letter:uppercase"
								>
									{exam.observation ?? 'Sin observaciones'}
								</span>
							</p>

							<Link
								href="/exams/{orderData.id}/edit/results/{exam.id}"
								linkClass="flex mt-4 mx-auto"
								class="!bg-green-500 hover:!bg-green-600"
							>
								<!-- class="!text-primary-blue !rounded-full !bg-inherit !p-0 hover:!text-purple-800" -->
								Editar examen
							</Link>
						</div>
					</AccordionItem>
				{/each}
			</Accordion>
		</div>

		<!-- TODO: If the exam is not marked as COMPLETED, these button should be disabled because there is nothing to send/show/download yet -->
		<div class="mt-8 flex items-center justify-center">
			<div
				class="direct-children:w-full direct-children:justify-center inline-flex justify-center gap-x-8"
			>
				<Link
					href="/exams/{orderData.id}/view"
					class="inline-flex w-full justify-center gap-x-1"
					linkClass="inline-flex"
					target="_blank"
					title={!areResultsReady ? 'Los resultados no están listos' : undefined}
					disabled={!areResultsReady}
				>
					<span>Visualizar</span>
					<span>
						<Icon src={Eye} size="24" />
					</span>
				</Link>

				<Link
					href="/exams/{orderData.id}/view?action=download"
					class="!bg-dark-blue hover:!bg-dark-blue/75 inline-flex w-full justify-center gap-x-1"
					linkClass="inline-flex"
					target="_blank"
					title={!areResultsReady ? 'Los resultados no están listos' : undefined}
					disabled={!areResultsReady}
				>
					<span>Descargar</span>

					<span>
						<Icon src={Download} size="24" />
					</span>
				</Link>
			</div>
		</div>
	</div>
</div>
