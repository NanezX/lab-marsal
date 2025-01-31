<script lang="ts">
	import '../app.css';
	import { SvelteToast, type SvelteToastOptions } from '@zerodevx/svelte-toast';

	let { children } = $props();

	const options: SvelteToastOptions = {
		duration: 5000,
		pausable: true
	};
</script>

<SvelteToast {options} />
<div class="flex h-full w-full items-center justify-center">
	{@render children()}
</div>
