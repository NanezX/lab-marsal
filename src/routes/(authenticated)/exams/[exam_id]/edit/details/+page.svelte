<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { fade } from 'svelte/transition';
	import BackButton from '$lib/components/buttons/BackButton.svelte';
	import Input from '$lib/components/Input.svelte';
	import { cleanEditPatientData, formatCapital } from '$lib/shared/utils.js';
	import Select from '$lib/components/Select.svelte';
	import { PatientGender } from '$lib/shared/enums.js';
	import Button from '$lib/components/Button.svelte';
	import CloseNavigationGuard from '$lib/components/modal/CloseNavigationGuard.svelte';
	import { isEqual } from 'lodash-es';
	import ConfirmModal from '$lib/components/modal/ConfirmModal.svelte';
	import Link from '$lib/components/Link.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
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
		ClockEdit,
		Edit,
		Progress
	} from '@steeze-ui/tabler-icons';
	import LabelValue from '$lib/components/LabelValue.svelte';

	let { data } = $props();

	let {
		editExamDetailsForm,
		examData: { patient: patientData, examType: examTypeData, ...examData }
	} = data;

	const {
		form,
		errors,
		constraints,
		enhance,
		submit: submitChanges
	} = superForm(editExamDetailsForm, {
		dataType: 'json',
		delayMs: 0,
		applyAction: true,
		onResult(event) {
			// If forms result type is a redirect or success, we assume that the changes were saved
			if (event.result.type === 'redirect' || event.result.type === 'success') {
				// hasChanges = false;
			}
		}
	});

	// const original = cleanEditPatientData(patientData);

	// let hasChanges = $derived(!isEqual($form, original));
	let hasChanges = $state(false);
	let showConfirmModal = $state(false);
	let showDiscardModal = $state(false);
</script>

<CloseNavigationGuard validator={() => hasChanges} bind:needConfirm={showDiscardModal} />

<form in:fade class="mb-4 flex w-full flex-col gap-y-8" use:enhance method="POST">
	<div class="relative flex justify-center">
		<BackButton href="/exams/{examData.id}" size="40" />

		<p class="mx-auto text-center text-3xl">Editar detalles del exámen</p>
	</div>

	<div>
		<div class="grid grid-cols-2 gap-x-1 gap-y-5">
			<div>
				<p class="inline-flex items-center gap-x-1 text-2xl">Datos generales</p>

				<div class="space-y-0.5 px-1 py-2">
					<LabelValue label="Exámen" value={examTypeData.name} icon={Cash} />
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

			<div>
				<p class="inline-flex items-center gap-x-1 text-2xl">Datos del paciente</p>

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

			<div class="col-span-2">
				<p class="text-center text-2xl">Detalles</p>

				<hr class="border-primary-gray/50 my-1" />

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
