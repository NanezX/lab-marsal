<script lang="ts">
	import type { PageProps } from './$types';
	import { fade } from 'svelte/transition';
	import Link from '$lib/components/Link.svelte';
	import BackButton from '$lib/components/buttons/BackButton.svelte';
	import Button from '$lib/components/Button.svelte';
	import { superForm } from 'sveltekit-superforms';
	import ConfirmModal from '$lib/components/modal/ConfirmModal.svelte';
	import { getAgeFromDate } from '$lib/client';
	import { PatientGender } from '$lib/shared/enums';
	import {
		Id,
		GenderMale,
		GenderFemale,
		Cake,
		Man,
		Woman,
		Mail,
		Phone,
		ClockPlus,
		ClockEdit
	} from '@steeze-ui/tabler-icons';
	import LabelValue from '$lib/components/LabelValue.svelte';
	import FilterControls from '$lib/components/FilterControls.svelte';

	// TODO: Verify AND check what roles can remove/delete an exam (maybe just block the page to those user in the backend)
	// TODO: Add exams created (and NOT deleted) for the users
	// TODO: Add fallback when no data found (no exams)

	let { data }: PageProps = $props();

	let {
		examData: { patient, examType, ...examData },
		deleteExamForm
	} = data;

	const { enhance, submit: submitDelete } = superForm(deleteExamForm, {
		dataType: 'json',
		delayMs: 0,
		applyAction: true
	});

	let showConfirmDeleteModal = $state(false);
</script>

<div in:fade class="mb-4 flex w-full flex-col gap-y-8">
	<form use:enhance method="POST" hidden></form>

	<div class="relative flex justify-center">
		<BackButton href="/exams" size="40" />

		<p class="mx-auto my-0 text-center text-3xl">{examType.name}</p>

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
</div>
