<script lang="ts">
	import { toastError, toastSuccess } from '$lib/toasts';
	import Input from '../Input.svelte';
	import BaseModal from './BaseModal.svelte';

	type PropType = {
		showModal: boolean;
		categories: string[];
		baseParameters: any[];
		editingIndex: number | null;
	};

	let {
		showModal = $bindable(),
		categories = $bindable(),
		baseParameters,
		editingIndex = $bindable()
	}: PropType = $props();

	let editingCategory = $state(editingIndex === null ? '' : categories[editingIndex]);
</script>

<BaseModal
	bind:showModal
	title="Edita el nombre de la categoria"
	onClose={() => {
		editingIndex = null;
		editingCategory = '';
	}}
	onSave={() => {
		if (editingIndex !== null) {
			// To silent variable marked as null by error
			let auxIndex = editingIndex;

			if (categories[auxIndex] === editingCategory) {
				return true;
			}

			if (categories[auxIndex] !== editingCategory && categories.includes(editingCategory)) {
				toastError('Ya existe una categoria con ese nombre');
				return false;
			}

			// Chagen the category on each parameter that has this category
			baseParameters.forEach((param_) => {
				if (param_.parameter.category == categories[auxIndex]) {
					param_.parameter.category = editingCategory;
				}
			});

			categories[auxIndex] = editingCategory;
		}

		toastSuccess('Nombre de la categoria actualizado');

		return true;
	}}
>
	<Input bind:value={editingCategory} name="editingCategory" />
</BaseModal>
