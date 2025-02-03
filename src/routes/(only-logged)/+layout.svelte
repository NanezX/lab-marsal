<script lang="ts">
	import NavBar from '$lib/components/navs/NavBar.svelte';
	import { toastSucces } from '$lib/toasts';
	import { SvelteToast, type SvelteToastOptions } from '@zerodevx/svelte-toast';

	let { children, data } = $props();

	const options: SvelteToastOptions = {
		duration: 5000,
		pausable: true
	};
</script>

<NavBar fullName={`${data.user.name} ${data.user.lastName}`} email={data.user.email} />
{@render children()}
