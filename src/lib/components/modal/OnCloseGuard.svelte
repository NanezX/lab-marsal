<script lang="ts">
	import ConfirmModal from './ConfirmModal.svelte';
	import NavigationGuard from './NavigationGuard.svelte';

	type PropType = {
		validator: () => boolean;
		needConfirm?: boolean;
	};

	let { validator, needConfirm = $bindable(false) }: PropType = $props();

	// Setup to confirm leaving the page
	let confirmLeave = () => {};

	function handleBlock(continueNav: () => void) {
		needConfirm = true;
		confirmLeave = continueNav;
	}

	function confirmAndLeave() {
		needConfirm = false;
		confirmLeave(); // Continue to nextUrl
		return true;
	}
</script>

<NavigationGuard shouldBlock={validator} onBlock={handleBlock} />

<ConfirmModal
	bind:showModal={needConfirm}
	text="Tienes cambios sin guardar. ¿Deseas salir?"
	onSave={confirmAndLeave}
	saveButtonText="Salir"
	onClose={() => (needConfirm = false)}
	cancelButtonText="Volver"
/>
