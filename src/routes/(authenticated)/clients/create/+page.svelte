<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { showToast } from '$lib/toasts.js';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';

	let { data } = $props();

	const { form, errors, enhance } = superForm(data.examTypeForm, {
		dataType: 'json',
		delayMs: 0,
		applyAction: true,
		onUpdated({ form }) {
			// Display message based on the response
			if (form.message) {
				showToast(form.message.text, form.message.type);

				if (form.message.type == 'success') {
					goto('/clients');
				}
			}
		}
	});
</script>

<form in:fade class="mb-4 flex w-full flex-col gap-y-8" use:enhance method="POST">
	<!--  -->
</form>
