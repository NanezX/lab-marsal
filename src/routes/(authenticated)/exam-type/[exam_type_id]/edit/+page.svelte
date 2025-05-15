<script lang="ts">
	import type { PageProps } from './$types';
	import Button from '$lib/components/Button.svelte';
	import { fade } from 'svelte/transition';
	import { sortArrayObject } from '$lib/shared/utils';
	import DisplayExamTypeParams from '$lib/components/DisplayExamTypeParams.svelte';
	import { generatePDF } from '$lib/client';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { PencilMinus } from '@steeze-ui/tabler-icons';
	import { superForm } from 'sveltekit-superforms';
	import { showToast } from '$lib/toasts.js';
	import { goto } from '$app/navigation';
	import Input from '$lib/components/Input.svelte';

	let { data }: PageProps = $props();

	let { examTypeForm, examTypeData } = data;

	const { form, errors, enhance } = superForm(examTypeForm, {
		dataType: 'json',
		delayMs: 0,
		applyAction: true,
		onUpdated({ form }) {
			// Display message based on the response
			if (form.message) {
				showToast(form.message.text, form.message.type);

				if (form.message.type == 'success') {
					goto('/exam-types');
				}
			}
		}
	});
</script>

<div class="space-y-4">
	<div class="flex gap-x-8">
		<Input
			bind:value={$form.name}
			name="name"
			label="Nombre del exámen"
			placeholder="Nombre del exámen"
			wrapperClass="w-1/2"
			error={$errors.name}
		/>

		<Input
			bind:value={$form.basePrice}
			type="number"
			name="basePrice"
			step="0.01"
			label="Precio base (USD)"
			placeholder="Precio base referencia"
			wrapperClass="w-1/2"
			error={$errors.basePrice}
		/>
	</div>
</div>
