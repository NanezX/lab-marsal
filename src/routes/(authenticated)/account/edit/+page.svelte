<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import BackButton from '$lib/components/buttons/BackButton.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Input from '$lib/components/Input.svelte';
	import ConfirmModal from '$lib/components/modal/ConfirmModal.svelte';
	import { LockOpen2, Lock } from '@steeze-ui/tabler-icons';
	import { fade } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();

	const {
		form,
		errors,
		constraints,
		enhance,
		submit: submitChanges
	} = superForm(data.editProfileForm, {
		dataType: 'json',
		delayMs: 0,
		applyAction: true
	});

	let showConfirmModal = $state(false);
</script>

<ConfirmModal
	bind:showModal={showConfirmModal}
	title="Confirmar cambio"
	secondaryText="Esta acción cambiará la información reflejada en tu perfil."
	saveButtonText="Confirmar"
	cancelButtonText="Cancelar"
	onSave={() => {
		submitChanges();
		return true;
	}}
/>
