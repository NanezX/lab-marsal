<script lang="ts">
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Input from '$lib/components/Input.svelte';
	import tree from '$lib/assets/tree.svg';
	import IconMarsal from '$lib/components/IconMarsal.svelte';
	import Button from '$lib/components/Button.svelte';
	import { At, Lock, LockOpen2 } from '@steeze-ui/tabler-icons';
	import { superForm } from 'sveltekit-superforms';
	import Spinner from '$lib/components/Spinner.svelte';
	import { fade } from 'svelte/transition';
	import { Blockquote } from 'flowbite-svelte';

	let { data } = $props();

	let passwordInputType: 'password' | 'text' = $state('password');
	let showPassword = $state(false);
	let iconPassword = $state(Lock);

	function togglePasswordInput(showPassword_: boolean) {
		if (showPassword_) {
			passwordInputType = 'text';
			iconPassword = LockOpen2;
		} else {
			passwordInputType = 'password';
			iconPassword = Lock;
		}
	}

	const { form, errors, constraints, enhance, delayed } = superForm(data.loginForm, {
		delayMs: 0
	});
</script>

<!-- Izquierda bienvenida -->
<div
	in:fade
	class="rounded-l-lm from-secondary-blue to-primary-blue w-3/5 space-y-10 rounded-l-xl bg-linear-to-br text-white"
>
	<div class="flex items-center justify-around">
		<IconMarsal />
		<h1 class="text-end text-4xl">Bienvenido a MarsalLab</h1>
	</div>

	<div class="space-y-10">
		<Blockquote size="lg" class="text-justify">
			Tu determinación es más fuerte que cualquier examen de bioanálisis.
		</Blockquote>

		<img src={tree} alt="Hermoso arbol al iniciar sesion" width="250" class="mx-auto" />
	</div>
</div>

<!-- Derecha login process -->
<div
	in:fade
	class="flex w-2/5 flex-col justify-center space-y-8 rounded-r-xl border border-gray-200 bg-white"
>
	<h3 class="text-primary-blue text-center text-2xl">Iniciar sesión</h3>

	<form class="flex flex-col gap-y-8" method="POST" action="?/login" use:enhance>
		<div class="space-y-4">
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

			<Input
				bind:value={$form.password}
				required
				type={passwordInputType}
				name="password"
				icon={iconPassword}
				placeholder="Contraseña"
				{...$constraints.password}
			/>
			{#if $errors.password}<span class="text-sm text-red-500">{$errors.password}</span>{/if}

			<Checkbox
				name="showPassword"
				bind:value={
					() => showPassword,
					(value) => {
						showPassword = value;
						togglePasswordInput(value);
					}
				}
				text="Mostrar contraseña"
			/>
		</div>

		<Button type="submit" disabled={$delayed} class="flex w-32 justify-center self-center">
			{#if $delayed}
				<Spinner class="h-6 w-6" />
			{:else}
				Iniciar sesión
			{/if}
		</Button>
	</form>

	<a class="text-primary-blue underline underline-offset-2 hover:text-blue-800" href="/recovery">
		Olvidé mi contraseña
	</a>
</div>
