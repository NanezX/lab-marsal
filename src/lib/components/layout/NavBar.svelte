<script lang="ts">
	import { slide } from 'svelte/transition';
	import icon from '$lib/assets/icon.png';
	import { ChevronDown, UserCircle, Logout } from '@steeze-ui/tabler-icons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { clickedOutside } from '../actions/clickedOutside';
	import Button from '../Button.svelte';

	// Prop type
	type PropType = {
		fullName: string;
		email: string;
	};

	let { fullName, email = 'No email' }: PropType = $props();

	let isOpen = $state(false);
</script>

<!-- Navigation bar -->
<div class="border-b-primary-blue/60 bg-secondary-blue/80 w-full border-b py-4 shadow-xl">
	<div class="mx-auto flex w-[80%] justify-between px-40">
		<a href="/home" title="Ir a inicio">
			<div class="flex items-center gap-x-2">
				<img alt="El logo de MarsalLab" src={icon} width="70" height="70" />
				<p class="text-xl font-bold">LabMarsal</p>
			</div>
		</a>

		<!-- Dropdown container -->
		<div
			class="relative inline-flex items-center"
			use:clickedOutside
			onclickedout={() => (isOpen = false)}
		>
			<Button
				onclick={() => (isOpen = !isOpen)}
				class="flex items-center gap-x-2 rounded-lg px-4 py-2"
			>
				<span>
					{fullName}
				</span>
				<span class={['mt-[2px] transition-transform duration-200', { 'rotate-180': isOpen }]}>
					<Icon src={ChevronDown} size="18" />
				</span>
			</Button>

			{#if isOpen}
				<div
					class="border-secondary-blue absolute top-full right-0 z-50 rounded-sm border bg-gray-200 p-1 text-center shadow-lg select-none"
					transition:slide
				>
					<p class="text-primary-gray m-2">{email}</p>
					<hr class="border-primary-gray/50 border-1" />

					<a
						href="account"
						class="hover:bg-secondary-blue my-1 inline-flex w-full cursor-pointer items-center justify-end gap-x-2 rounded-sm px-4 py-2"
					>
						<p>Mi perfil</p>
						<Icon src={UserCircle} size="24" />
					</a>

					<form method="POST" action="/logout">
						<button
							class="hover:bg-secondary-blue inline-flex w-full cursor-pointer items-center justify-end gap-x-2 rounded-sm px-4 py-2"
						>
							<p>Cerrar sesión</p>
							<Icon src={Logout} size="24" />
						</button>
					</form>
				</div>
			{/if}
		</div>
	</div>
</div>
