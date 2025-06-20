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
		Send2,
		FileDescription,
		TestPipe2
	} from '@steeze-ui/tabler-icons';
	import LabelValue from '$lib/components/LabelValue.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import ExamStatus from '$lib/components/ExamStatus.svelte';
	import { paymentMethodLabels } from '$lib/client';

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

					<LabelValue label="Creado" value={examData.createdAt.toLocaleString()} icon={ClockPlus} />

					{#if examData.createdAt.getTime() !== examData.updatedAt.getTime()}
						<LabelValue
							label="Último cambio"
							value={examData.updatedAt.toLocaleString()}
							icon={ClockEdit}
						/>
					{/if}
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
						<p
							class="mx-auto mb-2 flex w-1/2 items-center justify-center gap-x-1 border-b border-b-gray-300 text-xl font-semibold"
						>
							<span> Detalles </span>

							<Link
								href="/exams/{examData.id}/edit/details"
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

						<LabelValue label="Estado" icon={Progress}>
							{#snippet children()}
								<ExamStatus status={examData.status} priority={examData.priority} minimal />
							{/snippet}
						</LabelValue>

						<LabelValue label="Identificador" value={examData.customTag} icon={Label} />

						<LabelValue
							label="Entregado"
							value={examData.deliveredAt ? examData.deliveredAt.toLocaleString() : 'No entregado'}
							icon={TruckDelivery}
						/>
					</div>

					<div
						class="flex flex-col gap-y-1 rounded-xl border border-gray-200 bg-gray-100/75 px-1 py-2"
					>
						<p
							class="mx-auto mb-2 flex w-1/2 items-center justify-center gap-x-1 border-b border-b-gray-300 text-xl font-semibold"
						>
							<span> Pago </span>

							<Link
								href="/exams/{examData.id}/edit/payment"
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

						<LabelValue
							label="Estado"
							value={examData.paid ? 'Pago confirmado' : 'No pagado'}
							title={examData.paid ? 'Pago del exámen confirmado' : 'El exámen no ha sido pagado'}
							icon={Wallet}
						/>

						<!-- value={examData.paid && examData.paymentMethod ? examData.paymentMethod : 'N/A'} -->
						<LabelValue
							label="Método de pago"
							value={examData.paid && examData.paymentMethod
								? paymentMethodLabels[examData.paymentMethod]
								: 'N/A'}
							title={examData.paid && examData.paymentMethod
								? 'Método de pago'
								: 'El exámen no ha sido pagado'}
							icon={DeviceMobileCog}
						/>

						<LabelValue
							label="Monto pagado"
							value={examData.paid && examData.pricePaid ? examData.pricePaid : 'N/A'}
							title={examData.paid && examData.pricePaid
								? 'Monto final cancelado por el exámen'
								: 'El exámen no ha sido pagado'}
							icon={Moneybag}
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

			<div
				class="col-span-2 flex flex-col gap-y-4 rounded-xl border border-gray-200 bg-gray-100/75 px-1 py-2"
			>
				<p
					class="mx-auto mb-2 flex w-1/4 min-w-fit items-center justify-center gap-x-1 border-b border-b-gray-300 text-xl font-semibold"
				>
					<span> Resultados </span>

					<Link
						href="/exams/{examData.id}/edit/results"
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

				<div class="flex flex-col gap-y-1">
					<LabelValue label="Muestra" value={examData.sample ?? 'N/A'} icon={TestPipe2} />

					<p class="col-span-full flex flex-col gap-y-2" title="Observación del exámen">
						<span class="flex items-center gap-x-1">
							<Icon src={FileDescription} class="h-5 w-5" />
							<strong>Observación: </strong><br />
						</span>

						<span
							class="border-primary-blue/50 mx-2 max-h-60 overflow-y-auto rounded-xl border bg-gray-100 px-2 py-4 whitespace-pre-line"
						>
							{examData.observation ?? 'Sin observaciones'}
						</span>
					</p>
				</div>

				<!-- TODO: If the exam is not marked as COMPLETED, these button should be disabled because there is nothing to send/show/download yet -->
				<div
					class="direct-children:w-1/4 direct-children:justify-center inline-flex justify-center gap-x-8"
				>
					<Link
						href="/exams/{examData.id}/view"
						class="inline-flex w-full justify-center gap-x-1"
						linkClass="inline-flex"
						target="_blank"
					>
						<span>Visualizar</span>
						<span>
							<Icon src={Eye} size="24" />
						</span>
					</Link>

					<!-- class="!bg-dark-blue hover:!bg-dark-blue/75 inline-flex items-center gap-x-1" -->
					<Link
						href="/exams/{examData.id}/view?action=download"
						class="!bg-dark-blue hover:!bg-dark-blue/75 inline-flex w-full justify-center gap-x-1"
						linkClass="inline-flex"
						target="_blank"
					>
						<span>Descargar</span>

						<span>
							<Icon src={Download} size="24" />
						</span>
					</Link>
					<!-- <Button class="!bg-dark-blue hover:!bg-dark-blue/75 inline-flex items-center gap-x-1">
						<span>Descargar</span>

						<span>
							<Icon src={Download} size="24" />
						</span>
					</Button> -->

					<!-- TODO: Implementar logica para enviar los reusltados al correo del usuario si tiene uno asociado -->
					<Button
						class="!bg-primary-green hover:!bg-primary-green/75 inline-flex items-center gap-x-1"
						disabled={!patientData.email}
						title={patientData.email
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
			</div>
		</div>
	</div>
</div>
