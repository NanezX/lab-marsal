<script lang="ts">
	import '../app.css';
	import { SvelteToast, type SvelteToastOptions } from '@zerodevx/svelte-toast';
	import { page } from '$app/state';
	import { getFlash } from 'sveltekit-flash-message';
	import { showToast } from '$lib/toasts';

	let { children } = $props();

	const options: SvelteToastOptions = {
		duration: 5000,
		pausable: true
	};

	const flash = getFlash(page);

	$effect(() => {
		if (!$flash) return;

		showToast($flash.message, $flash.type);

		// Clear the flash message to avoid double-toasting.
		$flash = undefined;
	});
</script>

<SvelteToast {options} />
<div class="flex h-full w-full items-center justify-center">
	{@render children()}
</div>
