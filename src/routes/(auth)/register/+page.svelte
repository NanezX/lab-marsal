<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Input from '$lib/components/Input.svelte';
	import addUser from '$lib/assets/add-user.svg';
	import icon from '$lib/assets/icon.png';
	import Button from '$lib/components/Button.svelte';
	import { At, Lock, LockOpen2, User } from '@steeze-ui/tabler-icons';
	import { superForm } from 'sveltekit-superforms';
	import Spinner from '$lib/components/Spinner.svelte';
	import { toastError } from '$lib/toasts.js';
	import Select from '$lib/components/Select.svelte';
	import { UserRoles } from '$lib/shared/enums.js';

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

		// Usage of toastError to display login errors
		onUpdated({ form }) {
			if (form.message) {
				if (form.message.type == 'error') {
					toastError(form.message.text);
				}
			}
		}
	});
</script>

<!-- TODO: Move this page from the (auth) group. This page is only for logged users and of course, to users that have the access to this page -->
<Container class={['flex', 'direct-children:p-8', 'rounded-xl', 'w-2/3', 'max-w-5xl']}>
	<!-- Izquierda Saludo -->
	<div
		class="rounded-l-lm w-2/5 space-y-10 rounded-l-xl bg-gradient-to-br from-secondary-blue to-primary-blue text-white"
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

	<!-- TODO: Use separated variables for each input/select -->
	<!-- TODO: Validaciones para el form:  
			- Nombres: solo letras
			- Apellido: solo letras
			- Correo: listo
			- Rol: Solo rol valido
			- Password: minimo 8 caracteres, etc etc
			- Repeat Password: debe ser igual que Password
	 -->
	<!-- Derecha register new process -->
	<div class="flex w-3/5 flex-col justify-center space-y-8 rounded-r-xl border bg-white">
		<h3 class="text-center text-2xl text-primary-blue">Registrar nuevo usuario</h3>

		<form class="flex flex-col gap-y-8" method="POST" action="?/register" use:enhance>
			<div class="grid grid-cols-6 gap-x-2 gap-y-6">
				<Input
					bind:value={$form.name}
					name="name"
					required
					icon={User}
					placeholder="Nombre"
					wrapperClass="col-span-3"
					{...$constraints.name}
				/>
				{#if $errors.name}<span class="text-sm text-red-500">{$errors.name}</span>{/if}

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
				<Input
					bind:value={$form.email}
					type="email"
					name="email"
					required
					icon={At}
					placeholder="Correo electrónico"
					wrapperClass="col-span-4"
					{...$constraints.email}
				/>
				{#if $errors.email}<span class="text-sm text-red-500">{$errors.email}</span>{/if}

				<Select
					bind:value={$form.lastName}
					items={Object.values(UserRoles)}
					name="select"
					required
					placeholder="Selecciona el rol"
					class="col-span-2"
					{...$constraints.lastName}
				/>
				{#if $errors.lastName}<span class="text-sm text-red-500">{$errors.lastName}</span>{/if}

				<Input
					bind:value={$form.password}
					required
					type={passwordInputType}
					name="password"
					icon={iconPassword}
					placeholder="Contraseña"
					wrapperClass="col-span-3"
					{...$constraints.password}
				/>
				{#if $errors.password}<span class="text-sm text-red-500">{$errors.password}</span>{/if}
				<Input
					bind:value={$form.password}
					required
					type={passwordInputType}
					name="password"
					icon={iconPassword}
					placeholder="Repetir contraseña"
					wrapperClass="col-span-3"
					{...$constraints.password}
				/>
				{#if $errors.password}<span class="text-sm text-red-500">{$errors.password}</span>{/if}
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
</Container>
