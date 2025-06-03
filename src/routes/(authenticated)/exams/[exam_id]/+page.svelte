<script lang="ts">
	import type { PageProps } from './$types';
	import { fade } from 'svelte/transition';
	import Link from '$lib/components/Link.svelte';
	import BackButton from '$lib/components/buttons/BackButton.svelte';
	import Button from '$lib/components/Button.svelte';
	import { superForm } from 'sveltekit-superforms';
	import ConfirmModal from '$lib/components/modal/ConfirmModal.svelte';
	import { PatientGender } from '$lib/shared/enums';
	import {
		Id,
		GenderMale,
		GenderFemale,
		User,
		Cash,
		ListTree,
		Link as LinkIcon,
		Label,
		TestPipe2,
		TruckDelivery,
		Wallet,
		CodeDots,
		DeviceMobileCog,
		Moneybag,
		ClockPlus,
		ClockEdit
	} from '@steeze-ui/tabler-icons';
	import LabelValue from '$lib/components/LabelValue.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import ExamStatus from '$lib/components/ExamStatus.svelte';
	import { ExamStatus as ExamStatusEnum } from '$lib/shared/enums';

	// TODO: Verify AND check what roles can remove/delete an exam (maybe just block the page to those user in the backend)

	let { data }: PageProps = $props();

	let {
		examData: { patient: patientData, examType: examTypeData, ...examData },
		deleteExamForm
	} = data;

	const { enhance, submit: submitDelete } = superForm(deleteExamForm, {
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

		<p class="mx-auto my-0 text-center text-3xl">{examTypeData.name}</p>

		<div>
			<Link
				href="/exams/{examData.id}/edit"
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
		<div class="grid grid-cols-2 gap-x-1 gap-y-5">
			<div class="">
				<p class="inline-flex items-center gap-x-1 text-2xl">
					<span>Datos generales</span>
					<Link
						href="/exam-type/{examTypeData.id}"
						linkClass="flex mt-1"
						class="!text-primary-blue !rounded-full !bg-inherit !p-0 hover:!text-purple-800"
					>
						<Icon src={LinkIcon} class="h-5 w-5" />
					</Link>
				</p>

				<div class="space-y-0.5 px-1 py-2">
					<LabelValue label="Precio base" value={`${examTypeData.basePrice} $`} icon={Cash} />

					<LabelValue
						label="Clasificación"
						value={examTypeData.classification.name}
						icon={ListTree}
					/>
				</div>
			</div>

			<div class="">
				<p class="inline-flex items-center gap-x-1 text-2xl">
					<span>Datos del paciente</span>
					<Link
						href="/clients/{patientData.id}"
						linkClass="flex mt-1"
						class="!text-primary-blue !rounded-full !bg-inherit !p-0 hover:!text-purple-800"
					>
						<Icon src={LinkIcon} class="h-5 w-5" />
					</Link>
				</p>

				<div class="space-y-0.5 px-1 py-2">
					<LabelValue
						label="Nombre"
						value="{patientData.firstName} {patientData.lastName}"
						icon={User}
						labelClass="mr-1"
					/>
					<LabelValue label="Cédula" value={patientData.documentId} icon={Id} labelClass="mr-1" />

					<LabelValue
						label="Género"
						value={patientData.gender == PatientGender.Male ? 'Hombre' : 'Mujer'}
						icon={patientData.gender == PatientGender.Male ? GenderMale : GenderFemale}
						labelClass="mr-1"
					/>
				</div>
			</div>

			<div class="col-span-2 space-y-4">
				<p class="text-center text-2xl">Estado del exámen</p>

				<div class="grid grid-cols-2 gap-2">
					<div
						class="flex flex-col gap-y-1 rounded-xl border border-gray-200 bg-gray-100/75 px-1 py-2"
					>
						<p class="mx-auto w-1/2 border-b border-b-gray-300 text-center text-xl font-semibold">
							Detalles
						</p>

						<LabelValue label="Estado">
							{#snippet children()}
								<ExamStatus status={examData.status} priority={examData.priority} minimal={true} />
							{/snippet}
						</LabelValue>

						<LabelValue label="Identificador" value={examData.customTag} icon={Label} />

						<LabelValue label="Muestra" value={examData.sample ?? 'No aplica'} icon={TestPipe2} />

						{#if examData.status == ExamStatusEnum.Completed}
							<LabelValue
								label="Entregado"
								value={examData.deliveredAt
									? examData.deliveredAt.toLocaleString()
									: 'No entregado'}
								icon={TruckDelivery}
							/>
						{/if}

						<LabelValue
							class="mt-2 flex items-center gap-x-1"
							label="Creado"
							value={examData.createdAt.toLocaleString()}
							icon={ClockPlus}
						/>

						{#if examData.createdAt.getTime() !== examData.updatedAt.getTime()}
							<LabelValue
								class="mt-2 flex items-center gap-x-1"
								label="Último cambio"
								value={examData.updatedAt.toLocaleString()}
								icon={ClockEdit}
							/>
						{/if}
					</div>

					<div
						class="flex flex-col gap-y-1 rounded-xl border border-gray-200 bg-gray-100/75 px-1 py-2"
					>
						<p class="mx-auto w-1/2 border-b border-b-gray-300 text-center text-xl font-semibold">
							Pago
						</p>

						<LabelValue
							label="Estado"
							value={examData.paid ? 'Pago confirmado' : 'No pagado'}
							title={examData.paid ? 'Pago del exámen confirmado' : 'El exámen no ha sido pagado'}
							icon={Wallet}
						/>

						<LabelValue
							label="Monto pagado"
							value={examData.paid && examData.pricePaid ? examData.pricePaid : 'N/A'}
							title={examData.paid && examData.pricePaid
								? 'Monto final cancelado por el exámen'
								: 'El exámen no ha sido pagado'}
							icon={Moneybag}
						/>

						<LabelValue
							label="Método de pago"
							value={examData.paid && examData.paymentMethod ? examData.paymentMethod : 'N/A'}
							title={examData.paid && examData.paymentMethod
								? 'Método de pago'
								: 'El exámen no ha sido pagado'}
							icon={DeviceMobileCog}
						/>

						{#if examData.paid && examData.paymentRef}
							<LabelValue
								label="Ref. del pago"
								value={examData.paymentRef}
								title={'Referencia del pago por el exámen'}
								icon={CodeDots}
							/>
						{/if}
					</div>
				</div>
			</div>

			<!-- TODO: Design a bit how to show the specific description. If not description write, show N/A with some background -->
			<p>Descripción</p>

			<!-- TODO: Design a bit how to show the results. If not saved yet, show some emtpy card -->
			<p>RESULTADOS</p>
		</div>
	</div>
</div>
