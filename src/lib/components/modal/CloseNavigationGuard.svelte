<script lang="ts">
	import { onMount } from 'svelte';
	import { beforeNavigate } from '$app/navigation';
	import { goto } from '$app/navigation';
	import ConfirmModal from './ConfirmModal.svelte';

	type PropType = {
		validator: () => boolean;
		needConfirm?: boolean;
	};

	let { validator, needConfirm = $bindable(false) }: PropType = $props();

	let isConfirmed = $state(false);
	let nextUrl: string | null = null;
	let confirmLeave = () => {};

	function confirmedNavigation() {
		if (nextUrl) {
			isConfirmed = true;
			goto(nextUrl);
			nextUrl = null;
		}
	}

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

	// This is for internal SvelteKit navigation
	onMount(() => {
		const unsubscribe = beforeNavigate((nav) => {
			if (validator() && !isConfirmed && nav.to?.url) {
				nav.cancel(); // stop the navigation
				nextUrl = nav.to.url.pathname + nav.to.url.search + nav.to.url.hash;

				// Execute the onBlock function passed as a prop
				handleBlock(confirmedNavigation);
			}
		});

		return unsubscribe;
	});
</script>

<ConfirmModal
	bind:showModal={needConfirm}
	text="Tienes cambios sin guardar. ¿Deseas salir?"
	onSave={confirmAndLeave}
	saveButtonText="Salir"
	onClose={() => (needConfirm = false)}
	cancelButtonText="Volver"
/>
