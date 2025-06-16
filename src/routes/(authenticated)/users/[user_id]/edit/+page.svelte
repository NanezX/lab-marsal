<script lang="ts">
	import CloseNavigationGuard from '$lib/components/modal/CloseNavigationGuard.svelte';
	import ConfirmModal from '$lib/components/modal/ConfirmModal.svelte';
	import type { PageProps } from './$types';

	// Compare form vs original data
	// let hasChanges = $derived(!isEqual($form, original));
	let hasChanges = $state(false);
	let showConfirmModal = $state(false);
	let showDiscardModal = $state(false);
</script>

<CloseNavigationGuard validator={() => hasChanges} bind:needConfirm={showDiscardModal} />

<ConfirmModal
	bind:showModal={showConfirmModal}
	title="Confirmar cambios"
	secondaryText="Esto puede afectar  el acceso del usuario"
	saveButtonText="Guardar cambios"
	cancelButtonText="Cancelar"
	onSave={() => {
		// submitChanges();
		return true;
	}}
/>

<div in:fade class="mb-4 flex w-full flex-col gap-y-8">
	<form use:enhance method="POST" hidden></form>
	<!--  -->
</div>
