<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { fade } from 'svelte/transition';
	import BackButton from '$lib/components/buttons/BackButton.svelte';
	import Input from '$lib/components/Input.svelte';
	import { cleanEditOrderDetails } from '$lib/shared/utils.js';
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
	import { orderDeliverStatusItems, priorityItems } from '$lib/client/enumItems.js';

	let { data } = $props();

	let { editOrderDetailsForm, orderData } = data;
	let { patient: patientData } = orderData;

	const {
		form,
		errors,
		enhance,
		submit: submitChanges
	} = superForm(editOrderDetailsForm, {
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

	const original = cleanEditOrderDetails(orderData);

	let hasChanges = $derived(!isEqual($form, original));
	let showConfirmModal = $state(false);
	let showDiscardModal = $state(false);
</script>

<CloseNavigationGuard validator={() => hasChanges} bind:needConfirm={showDiscardModal} />

<ConfirmModal
	bind:showModal={showConfirmModal}
	title="Confirmar cambios"
	secondaryText="Revise los cambios realizados antes de confirmar"
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

		<p class="mx-auto text-center text-3xl">Editar detalles de la orden</p>
	</div>

	<div>
		<div class="grid grid-cols-2 gap-x-1 gap-y-5">
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
				<p class="mb-4 text-center text-2xl">Actualizar detalles</p>

				<div class="space-y-4">
					<div class="flex gap-x-8">
						<div class="flex w-1/3 flex-col items-start gap-y-1">
							<label class="ml-2 font-semibold" for="select-priority"> Prioridad del exámen</label>

							<Select
								bind:value={$form.priority}
								items={priorityItems}
								name="priority"
								id="select-priority"
								required
								placeholder="Seleccionar prioridad"
							/>
						</div>

						<div class="flex w-1/3 flex-col items-start gap-y-1">
							<label class="ml-2 font-semibold" for="select-priority"> Estado del exámen </label>

							<Select
								bind:value={$form.delivered}
								items={orderDeliverStatusItems}
								name="priority"
								id="select-priority"
								required
								placeholder="Seleccionar estado de entrega"
							/>
						</div>
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
