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

<form in:fade class="mb-4 flex w-full flex-col gap-y-8" use:enhance method="POST">
	<div class="relative flex justify-center">
		<BackButton href="/account" size="40" />

		<p class="mx-auto text-center text-3xl">Editar perfil</p>
	</div>
</form>
