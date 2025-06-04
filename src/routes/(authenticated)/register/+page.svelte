<script lang="ts">
	import Input from '$lib/components/Input.svelte';
	import addUser from '$lib/assets/add-user.svg';
	import icon from '$lib/assets/icon.png';
	import Button from '$lib/components/Button.svelte';
	import { At, Cake, Id, Lock, LockOpen2, User } from '@steeze-ui/tabler-icons';
	import { superForm } from 'sveltekit-superforms';
	import Spinner from '$lib/components/Spinner.svelte';
	import Select from '$lib/components/Select.svelte';
	import { UserRoles } from '$lib/shared/enums.js';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import { formatCapital, maxDocumentId, minDocumentId } from '$lib/shared/utils.js';
	import { userRolesItems } from '$lib/client/enumItems.js';

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

	const { form, errors, constraints, enhance, delayed } = superForm(data.registerForm, {
		delayMs: 0,
		applyAction: true
	});
</script>

<!-- Izquierda Saludo -->
<div
	class="rounded-l-lm from-secondary-blue to-primary-blue w-2/5 space-y-10 rounded-l-xl bg-linear-to-br text-white"
>
	<div class="flex items-center justify-around">
		<img alt="El logo de MarsalLab" src={icon} width="100" height="100" />

		<h1 class="text-end text-4xl">Nuevo usuario</h1>
	</div>

	<div class="space-y-10">
		<p class="mx-auto w-5/6 text-justify">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
			labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
			laboris nisi ut aliquip ex ea commodo consequat.
		</p>

		<img src={addUser} alt="Añadir usuario imagen" width="180" class="mx-auto" />
	</div>
</div>

<!-- Derecha register new process -->
<div
	class="flex w-3/5 flex-col justify-center space-y-8 rounded-r-xl border border-gray-200 bg-white"
>
	<h3 class="text-primary-blue text-center text-2xl">Registrar nuevo usuario</h3>

	<form class="flex flex-col gap-y-8" method="POST" action="?/register" use:enhance>
		<div class="grid grid-cols-6 gap-x-2 gap-y-6">
			<!-- First name -->
			<Input
				bind:value={$form.firstName}
				name="firstName"
				required
				icon={User}
				placeholder="Nombre"
				wrapperClass="col-span-3"
				{...$constraints.firstName}
			/>
			{#if $errors.firstName}<span class="text-sm text-red-500">{$errors.firstName}</span>{/if}

			<!-- Last name -->
			<Input
				bind:value={$form.lastName}
				name="lastName"
				required
				icon={User}
				placeholder="Apellido"
				wrapperClass="col-span-3"
				{...$constraints.lastName}
			/>
			{#if $errors.lastName}<span class="text-sm text-red-500">{$errors.lastName}</span>{/if}

			<!-- Document ID -->
			<Input
				bind:value={$form.documentId}
				type="number"
				name="documentId"
				required
				icon={Id}
				placeholder="Cédula"
				autoComplete={false}
				min={minDocumentId}
				max={maxDocumentId}
				wrapperClass="col-span-3"
				{...$constraints.documentId}
			/>
			{#if $errors.documentId}<span class="text-sm text-red-500">{$errors.documentId}</span>{/if}

			<!-- Cumpleaños -->
			<Input
				bind:value={$form.birthdate}
				type="date"
				name="birthdate"
				required
				icon={Cake}
				placeholder="Cumpleaños"
				wrapperClass="col-span-3"
				{...$constraints.lastName}
			/>
			{#if $errors.birthdate}<span class="text-sm text-red-500">{$errors.birthdate}</span>{/if}

			<!-- Email -->
			<Input
				bind:value={$form.email}
				type="email"
				name="email"
				required
				icon={At}
				placeholder="Correo electrónico"
				autoComplete={false}
				wrapperClass="col-span-4"
				{...$constraints.email}
			/>
			{#if $errors.email}<span class="text-sm text-red-500">{$errors.email}</span>{/if}

			<!-- User roles - Select -->
			<Select
				bind:value={$form.role}
				items={userRolesItems}
				forcePlaceholder
				name="role"
				required
				placeholder="Selecciona un rol"
				class="col-span-2"
				{...$constraints.role}
			/>
			{#if $errors.role}<span class="text-sm text-red-500">{$errors.role}</span>{/if}

			<!-- Password -->
			<Input
				bind:value={$form.password}
				required
				type={passwordInputType}
				name="password"
				icon={iconPassword}
				placeholder="Contraseña"
				autoComplete={false}
				wrapperClass="col-span-3"
				{...$constraints.password}
			/>
			{#if $errors.password}<span class="text-sm text-red-500">{$errors.password}</span>{/if}

			<!-- Repeat Password -->
			<Input
				bind:value={$form.repeatPassword}
				required
				type={passwordInputType}
				name="repeatPassword"
				icon={iconPassword}
				placeholder="Repetir contraseña"
				autoComplete={false}
				wrapperClass="col-span-3"
				{...$constraints.repeatPassword}
			/>
			{#if $errors.repeatPassword}<span class="text-sm text-red-500">{$errors.repeatPassword}</span
				>{/if}

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
				Registrar
			{/if}
		</Button>
	</form>
</div>
