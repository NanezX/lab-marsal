<script lang="ts">
	import IconMarsal from '$lib/components/IconMarsal.svelte';
	import recoveryIcon from '$lib/assets/recovery-user.svg';
	import { superForm } from 'sveltekit-superforms';
	import Input from '$lib/components/Input.svelte';
	import { At } from '@steeze-ui/tabler-icons';
	import Button from '$lib/components/Button.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { fade } from 'svelte/transition';
	import { Blockquote } from 'flowbite-svelte';

	let { data } = $props();

	const { form, errors, constraints, enhance, delayed } = superForm(data.recoveryForm, {
		delayMs: 0
	});
</script>

<!-- Izquierda Recuperar contraseña -->
<div
	in:fade
	class="rounded-l-lm from-secondary-blue to-primary-blue w-3/5 space-y-10 rounded-l-xl bg-linear-to-br text-white"
>
	<div class="flex items-center justify-around">
		<IconMarsal />

		<h1 class="text-end text-4xl">Recuperar contraseña</h1>
	</div>

	<div class="space-y-10">
		<Blockquote size="lg" class="text-justify">
			El bioanálisis es un arte que requiere precisión y pasión. ¡Demuéstralo en cada análisis!
		</Blockquote>

		<img src={recoveryIcon} alt="Recuperar contraseña imagen" width="250" class="mx-auto" />
	</div>
</div>

<!-- Derecha recovery process -->
<div
	in:fade
	class="flex w-2/5 flex-col justify-center space-y-8 rounded-r-xl border border-gray-200 bg-white"
>
	<h3 class="text-primary-blue text-center text-2xl">Correo de la cuenta</h3>

	<p class="text-justify">Debes tener acceso al correo electrónico para recuperar la cuenta.</p>

	<form class="flex flex-col gap-y-8" method="POST" action="?/recovery" use:enhance>
		<div class="space-y-2">
			<Input
				bind:value={$form.email}
				type="email"
				name="email"
				required
				icon={At}
				placeholder="Correo electrónico"
				{...$constraints.email}
			/>
			{#if $errors.email}<span class="text-sm text-red-500">{$errors.email}</span>{/if}
		</div>

		<Button type="submit" disabled={$delayed} class="flex w-32 justify-center self-center">
			{#if $delayed}
				<Spinner class="h-6 w-6" />
			{:else}
				Solicitar
			{/if}
		</Button>
	</form>

	<a class="text-primary-blue underline underline-offset-2 hover:text-blue-800" href="/login">
		Iniciar sesión
	</a>
</div>
