<script lang="ts">
	import { onMount } from 'svelte';
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

	// This shows the native browser dialog ("Do you want to leave?").
	onMount(() => {
		const handler = (event: BeforeUnloadEvent) => {
			if (validator()) {
				event.preventDefault();
				event.returnValue = ''; // Required for Chrome
			}
		};

		window.addEventListener('beforeunload', handler);
		return () => window.removeEventListener('beforeunload', handler);
	});
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
