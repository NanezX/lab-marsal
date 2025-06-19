<script lang="ts">
	import BackButton from '$lib/components/buttons/BackButton.svelte';
	import { fade } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();

	const { form, errors, constraints, enhance } = superForm(data.changePasswordForm, {
		dataType: 'json',
		delayMs: 0,
		applyAction: true
	});
</script>

<form in:fade class="mb-4 flex w-full flex-col gap-y-8" use:enhance method="POST">
	<div class="relative flex justify-center">
		<BackButton href="/clients" size="40" />

		<p class="mx-auto text-center text-3xl">Cambiar contraseña</p>
	</div>
</form>
