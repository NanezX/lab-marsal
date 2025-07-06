<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { fade } from 'svelte/transition';
	import BackButton from '$lib/components/buttons/BackButton.svelte';
	import Input from '$lib/components/Input.svelte';
	import { cleanEditOrderPayment } from '$lib/shared/utils.js';
	import Select from '$lib/components/Select.svelte';
	import { PatientGender } from '$lib/shared/enums.js';
	import Button from '$lib/components/Button.svelte';
	import CloseNavigationGuard from '$lib/components/modal/CloseNavigationGuard.svelte';
	import { isEqual } from 'lodash-es';
	import ConfirmModal from '$lib/components/modal/ConfirmModal.svelte';
	import {
		Id,
		GenderMale,
		GenderFemale,
		User,
		Cash,
		ListTree,
		ClockPlus,
		ClockEdit
	} from '@steeze-ui/tabler-icons';
	import LabelValue from '$lib/components/LabelValue.svelte';
	import { examPaidItems, examPaymentMethodItems } from '$lib/client/enumItems.js';

	let { data } = $props();

	let { editOrderPaymentForm, orderData } = data;
	let { patient: patientData } = orderData;

	const {
		form,
		errors,
		enhance,
		submit: submitChanges
	} = superForm(editOrderPaymentForm, {
		dataType: 'json',
		delayMs: 0,
		applyAction: true,
		onResult(event) {
			// If forms result type is a redirect or success, we assume that the changes were saved
			if (event.result.type === 'redirect' || event.result.type === 'success') {
				hasChanges = false;
			}
		}
	});

	const original = cleanEditOrderPayment(orderData);

	let hasChanges = $derived(!isEqual($form, original));
	let showConfirmModal = $state(false);
	let showDiscardModal = $state(false);
</script>

<CloseNavigationGuard validator={() => hasChanges} bind:needConfirm={showDiscardModal} />

<ConfirmModal
	bind:showModal={showConfirmModal}
	title="Confirmar cambios"
	secondaryText={'Revise los cambios realizados antes de confirmar' +
		(original.paid && !$form.paid ? '. Los datos de pagos serán reiniciados' : '')}
	saveButtonText="Guardar cambios"
	cancelButtonText="Cancelar"
	onSave={() => {
		submitChanges();
		return true;
	}}
/>

<form in:fade class="mb-4 flex w-full flex-col gap-y-8" use:enhance method="POST">
	<div class="relative flex justify-center">
		<BackButton href="/exams/{orderData.id}" size="40" />

		<p class="mx-auto text-center text-3xl">Editar detalles de pago</p>
	</div>

	<div>
		<div class="grid grid-cols-2 gap-x-1 gap-y-5">
			<div>
				<p class="inline-flex items-center gap-x-1 text-2xl">Datos generales</p>

				<div class="space-y-0.5 px-1 py-2">
					<LabelValue label="Precio total" value={`${orderData.totalPrice} $`} icon={Cash} />
				</div>
			</div>

			<div>
				<p class="inline-flex items-center gap-x-1 text-2xl">Datos del paciente</p>

				<div class="space-y-0.5 px-1 py-2">
					<LabelValue
						label="Nombre"
						value="{patientData.firstName} {patientData.lastName}"
						icon={User}
						labelClass="mr-1"
					/>
					<LabelValue
						label="Cédula"
						value={patientData.documentId ?? 'N/A'}
						icon={Id}
						labelClass="mr-1"
					/>

					<LabelValue
						label="Género"
						value={patientData.gender == PatientGender.Male ? 'Hombre' : 'Mujer'}
						icon={patientData.gender == PatientGender.Male ? GenderMale : GenderFemale}
						labelClass="mr-1"
					/>
				</div>
			</div>

			<div class="col-span-2">
				<p class="mb-4 text-center text-2xl">Detalles de pago</p>

				<div class="space-y-4">
					<div class="flex gap-x-8">
						<div class="flex w-2/5 flex-col items-start gap-y-1">
							<label class="ml-2 font-semibold" for="select-priority"> Estado de pago</label>

							<Select
								bind:value={
									() => $form.paid,
									(v) => {
										$form.paid = v;
										if (!v) {
											$form.paymentMethod = undefined;
											$form.pricePaid = undefined;
											$form.paymentRef = undefined;
										}
									}
								}
								items={examPaidItems}
								name="paid"
								id="select-paid"
								required
								placeholder="Marcar estado de pago"
							/>
						</div>

						<div class="flex w-2/5 flex-col items-start gap-y-1">
							<label class="ml-2 font-semibold" for="select-priority"> Método de pago </label>

							<Select
								bind:value={$form.paymentMethod}
								items={examPaymentMethodItems}
								name="paymentMethod"
								id="select-paymentMethod"
								required
								placeholder="Seleccionar método de pago"
								disabled={!$form.paid}
							/>

							{#if $errors.paymentMethod}
								<span class="text-sm text-red-500">
									{$errors.paymentMethod}
								</span>
							{/if}
						</div>
					</div>

					<div class="flex gap-x-8">
						<Input
							bind:value={
								() =>
									$form.pricePaid === 0 || $form.pricePaid === undefined
										? ''
										: $form.pricePaid.toString(),
								(v: string) => {
									$form.pricePaid = v === '' ? undefined : Number(v.replace(/[^0-9]/g, ''));
								}
							}
							name="pricePaid"
							label="Precio pagado"
							placeholder="Precio pagado"
							title="Precio pagado"
							wrapperClass="w-2/5"
							error={$errors.pricePaid}
							disabled={!$form.paid}
						/>
						<Input
							bind:value={
								() => $form.paymentRef ?? '', (v) => ($form.paymentRef = v === '' ? undefined : v)
							}
							name="paymentRef"
							label="Referencia (opcional)"
							placeholder="Referencia de pago"
							title="Referencia de pago"
							wrapperClass="w-2/5"
							error={$errors.paymentRef}
							disabled={!$form.paid}
						/>
					</div>
				</div>
			</div>

			<div class="col-span-2">
				<hr class="border-primary-gray/50 my-1 mb-4" />

				<div class="mx-auto w-fit space-x-10">
					<Button
						disabled={!hasChanges}
						onclick={() => (showConfirmModal = true)}
						title="Guardar cambios"
						class="w-fit !bg-green-500 hover:!bg-green-400 disabled:!bg-gray-200"
					>
						Guardar cambios
					</Button>
				</div>
			</div>
		</div>
	</div>
</form>
