<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import BackButton from '$lib/components/buttons/BackButton.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Input from '$lib/components/Input.svelte';
	import ConfirmModal from '$lib/components/modal/ConfirmModal.svelte';
	import { LockOpen2, Lock } from '@steeze-ui/tabler-icons';
	import { fade } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();

	const {
		form,
		errors,
		constraints,
		enhance,
		submit: submitChanges
	} = superForm(data.changePasswordForm, {
		dataType: 'json',
		delayMs: 0,
		applyAction: true
	});

	let showConfirmModal = $state(false);
	let showoldPassword = $state(false);
	let showNewPassword = $state(false);
	let showRepeatedPassword = $state(false);
</script>

<ConfirmModal
	bind:showModal={showConfirmModal}
	title="Confirmar cambio de contraseña"
	secondaryText="Esta acción cambiará tu contraseña actual."
	saveButtonText="Cambiar contraseña"
	cancelButtonText="Cancelar"
	onSave={() => {
		submitChanges();
		return true;
	}}
/>

<form in:fade class="mb-4 flex w-full flex-col gap-y-8" use:enhance method="POST">
	<div class="relative flex justify-center">
		<BackButton href="/clients" size="40" />

		<p class="mx-auto text-center text-3xl">Cambiar contraseña</p>
	</div>

	<div>
		<div class="space-y-5">
			<div class="space-y-4">
				<div class="flex w-2/5 flex-col gap-y-2">
					<Input
						bind:value={$form.oldPassword}
						label="Contraseña actual"
						required
						type={showoldPassword ? 'text' : 'password'}
						name="oldPassword"
						icon={showoldPassword ? LockOpen2 : Lock}
						placeholder="Contraseña actual"
						autoComplete={false}
						{...$constraints.oldPassword}
					/>

					<div class="flex">
						<Checkbox
							name="showoldPassword"
							bind:value={showoldPassword}
							text="Mostrar"
							wrapperClass=""
						/>

						{#if $errors.oldPassword !== undefined && $errors.oldPassword.length > 0}
							<span in:fade class="text-sm text-red-500">{$errors.oldPassword}</span>
						{/if}
					</div>
				</div>

				<hr class="border-primary-gray/50 my-4" />

				<div class="flex gap-x-8">
					<div class="flex w-2/5 flex-col gap-y-2">
						<Input
							bind:value={$form.newPassword}
							label="Nueva contraseña"
							required
							type={showNewPassword ? 'text' : 'password'}
							name="newPassword"
							icon={showNewPassword ? LockOpen2 : Lock}
							placeholder="Nueva contraseña"
							autoComplete={false}
							{...$constraints.newPassword}
						/>

						<div class="flex">
							<Checkbox
								name="showNewPassword"
								bind:value={showNewPassword}
								text="Mostrar"
								wrapperClass=""
							/>

							{#if $errors.newPassword !== undefined && $errors.newPassword.length > 0}
								<span in:fade class="text-sm text-red-500">{$errors.newPassword}</span>
							{/if}
						</div>
					</div>
					<div class="flex w-2/5 flex-col gap-y-2">
						<Input
							bind:value={$form.repeatNewPassword}
							label="Repetir contraseña"
							required
							type={showRepeatedPassword ? 'text' : 'password'}
							name="repeatNewPassword"
							icon={showRepeatedPassword ? LockOpen2 : Lock}
							placeholder="Repetir contraseña"
							autoComplete={false}
							{...$constraints.repeatNewPassword}
						/>

						<div class="flex">
							{#if $errors.repeatNewPassword !== undefined && $errors.repeatNewPassword.length > 0}
								<span in:fade class="text-sm text-red-500">{$errors.repeatNewPassword}</span>
							{/if}

							<Checkbox
								name="showRepeatedPassword"
								bind:value={showRepeatedPassword}
								text="Mostrar"
								wrapperClass=""
							/>
						</div>
					</div>
				</div>

				<hr class="border-primary-gray/50 my-4" />

				<div class="mx-auto w-fit space-x-10">
					<Button
						title="Cancelar"
						class="w-fit !bg-red-500 hover:!bg-red-400"
						onclick={() => goto('/account')}>Cancelar</Button
					>

					<!-- type="submit" -->
					<Button
						title="Cambiar contraseña"
						class="w-fit !bg-green-500 hover:!bg-green-400 disabled:!bg-gray-200 "
						onclick={() => (showConfirmModal = true)}
						disabled={!$form.oldPassword || !$form.newPassword}
					>
						Guardar
					</Button>
				</div>
			</div>
		</div>
	</div>
</form>
