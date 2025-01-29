<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Input from '$lib/components/Input.svelte';
	import tree from '$lib/assets/tree.svg';
	import icon from '$lib/assets/icon.png';
	import { At, Lock, LockOpen2 } from '@steeze-ui/tabler-icons';
	import Button from '$lib/components/Button.svelte';

	let email = $state('');
	let password = $state('');
	let passwordInputType: 'password' | 'text' = $state('password');
	let showPassword = $state(false);
	let iconPassword = $state(Lock);

	function togglePasswordInput() {
		if (passwordInputType == 'password') {
			passwordInputType = 'text';
			iconPassword = LockOpen2;
		} else {
			passwordInputType = 'password';
			iconPassword = Lock;
		}
	}
</script>

<div class="flex h-full w-full items-center justify-center">
	<Container class={['flex', 'direct-children:p-8', 'rounded-xl', 'w-2/3']}>
		<!-- Izquierda bienvenida -->
		<div
			class="from-secondary-blue to-primary-blue rounded-l-lm w-3/5 space-y-10 rounded-l-xl bg-gradient-to-br text-white"
		>
			<div class="flex items-center justify-around">
				<img alt="El logo de MarsalLab" src={icon} width="100" height="100" />

				<h1 class="text-end text-4xl">Bienvenido a MarsalLab</h1>
			</div>

			<div class="space-y-10">
				<p class="mx-auto w-5/6 text-justify">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
					ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
					ullamco laboris nisi ut aliquip ex ea commodo consequat.
				</p>

				<img src={tree} alt="Hermoso arbol al iniciar sesion" width="250" class="mx-auto" />
			</div>
		</div>

		<!-- Derecha login process -->
		<div class="flex w-2/5 flex-col justify-center space-y-8 rounded-r-xl border bg-white">
			<h3 class="text-primary-blue text-center text-2xl">Iniciar sesión</h3>
			<form class="flex flex-col gap-y-8">
				<div class="space-y-4">
					<Input bind:value={email} type="email" icon={At} placeholder="Correo electrónico" />
					<Input
						bind:value={password}
						type={passwordInputType}
						icon={iconPassword}
						placeholder="Contraseña"
					/>
					<Checkbox
						bind:value={
							() => showPassword,
							(v) => {
								togglePasswordInput();
								return showPassword;
							}
						}
						text="Mostrar contraseña"
					/>
				</div>
				<Button
					class="w-fit self-center"
					onclick={() => {
						alert('clicked');
					}}
				>
					Iniciar sesión</Button
				>
			</form>
		</div>
	</Container>
</div>
