<script lang="ts">
	import { toastError, toastSuccess } from '$lib/toasts';
	import Input from '../Input.svelte';
	import BaseModal from './BaseModal.svelte';

	type PropType = {
		showModal: boolean;
		items: string[];
		editingIndex: number | null;
		title?: string;
	};

	let {
		showModal = $bindable(),
		items = $bindable(),
		editingIndex = $bindable(),
		title
	}: PropType = $props();

	let editingItem = $state(editingIndex === null ? '' : items[editingIndex]);
</script>

<BaseModal
	bind:showModal
	{title}
	onClose={() => {
		editingIndex = null;
		editingItem = '';
	}}
	onSave={() => {
		if (editingIndex !== null) {
			// To silent variable marked as null by error
			let auxIndex = editingIndex;
			if (items[auxIndex] === editingItem) {
				return true;
			}

			// Leaving this in case we want to support no repeated parts
			// if (items[auxIndex] !== editingItem && categories.includes(editingItem)) {
			// 	toastError('Ya existe una categoria con ese nombre');
			// 	return false;
			// }

			// Assign the new item
			items[auxIndex] = editingItem;
		}

		toastSuccess('Nombre de la categoria actualizado');

		return true;
	}}
>
	<Input bind:value={editingItem} name="editingCategory" />
</BaseModal>
