<script lang="ts">
	import IconMarsal from '$lib/components/IconMarsal.svelte';
	import VerifyRecoveryIcon from '$lib/assets/verify-recovery.svg';
	import { Lock, LockOpen2, Key } from '@steeze-ui/tabler-icons';
	import { superForm } from 'sveltekit-superforms';
	import { showToast } from '$lib/toasts';
	import Input from '$lib/components/Input.svelte';
	import Button from '$lib/components/Button.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import Checkbox from '$lib/components/Checkbox.svelte';

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

	const { form, errors, constraints, enhance, delayed, reset } = superForm(
		data.verifyRecoveryForm,
		{
			resetForm: false,
			delayMs: 0,
			onUpdated({ form }) {
				// Display recovery messages
				if (form.message) {
					showToast(form.message.text, form.message.type, ['warning']);

					if (form.message.type == 'error') {
						// Only reset the code
						reset({ data: { ...form.data, code: '' } });
					}

					if (form.message.type == 'success') {
						goto('/login');
					}
				}
			}
		}
	);
</script>

<!-- Izquierda Verificar recuperacion -->
<div
	in:fade
	class="rounded-l-lm from-secondary-blue to-primary-blue w-3/5 space-y-10 rounded-l-xl bg-linear-to-br text-white"
>
	<div class="flex items-center justify-around">
		<IconMarsal />

		<h1 class="text-end text-4xl">Recuperar contraseña</h1>
	</div>

	<div class="space-y-10">
		<p class="mx-auto w-5/6 text-justify">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
			labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
			laboris nisi ut aliquip ex ea commodo consequat.
		</p>

		<img
			src={VerifyRecoveryIcon}
			alt="Verificar recuperación de contraseña imagen"
			width="250"
			class="mx-auto"
		/>
	</div>
</div>

<!-- Derecha recovery data process -->
<div
	in:fade
	class="flex w-2/5 flex-col justify-center space-y-8 rounded-r-xl border border-gray-200 bg-white"
>
	<h3 class="text-primary-blue text-center text-2xl">Recuperación</h3>

	<p class="text-justify">
		Utilzia el código de 5 dígitos que recibiste en <strong>{data.user?.email}</strong>
	</p>

	<form class="flex flex-col gap-y-8" method="POST" action="?/verify-recovery" use:enhance>
		<div class="space-y-6">
			<div class="space-y-2">
				<!-- Code -->
				<Input
					bind:value={$form.code}
					required
					name="code"
					icon={Key}
					placeholder="Código"
					autoComplete={false}
					class="not-placeholder-shown:uppercase"
					wrapperClass="mb-8"
					maxlength={5}
					{...$constraints.code}
				/>
				{#if $errors.code}
					<span class="text-sm text-red-500"> {$errors.code}</span>
				{/if}

				<!-- Password -->
				<Input
					bind:value={$form.password}
					required
					type={passwordInputType}
					name="password"
					icon={iconPassword}
					placeholder="Nueva contraseña"
					autoComplete={false}
					{...$constraints.password}
				/>
				{#if $errors.password}
					<span class="text-sm text-red-500"> {$errors.password}</span>
				{/if}

				<!-- Repeat Password -->
				<Input
					bind:value={$form.repeatPassword}
					required
					type={passwordInputType}
					name="repeatPassword"
					icon={iconPassword}
					placeholder="Repetir contraseña"
					autoComplete={false}
					{...$constraints.repeatPassword}
				/>
				{#if $errors.repeatPassword}
					<span class="text-sm text-red-500">
						{$errors.repeatPassword}
					</span>
				{/if}
			</div>

			<!-- Show password checkbox -->
			<Checkbox
				bind:value={
					() => showPassword,
					(value) => {
						showPassword = value;
						togglePasswordInput(value);
					}
				}
				wrapperClass="col-span-3 col-start-4 mt-[-1rem]"
				text="Mostrar contraseña"
			/>
		</div>

		<Button type="submit" disabled={$delayed} class="flex w-32 justify-center self-center">
			{#if $delayed}
				<Spinner class="h-6 w-6" />
			{:else}
				Recuperar
			{/if}
		</Button>
	</form>
</div>
