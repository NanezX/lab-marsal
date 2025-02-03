<script lang="ts">
	import { toastSucces } from '$lib/toasts';
	import { SvelteToast, type SvelteToastOptions } from '@zerodevx/svelte-toast';

	let { children } = $props();

	const options: SvelteToastOptions = {
		duration: 5000,
		pausable: true
	};
</script>

{@render children()}
