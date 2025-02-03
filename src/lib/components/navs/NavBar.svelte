<script lang="ts">
	import { slide, fly } from 'svelte/transition';
	import icon from '$lib/assets/icon.png';
	import { ChevronDown, UserCircle, Logout } from '@steeze-ui/tabler-icons';
	import { Icon } from '@steeze-ui/svelte-icon';

	ChevronDown;

	// Prop type
	type PropType = {
		fullName: string;
		email: string;
	};

	let { fullName, email = 'No email' }: PropType = $props();

	let isOpen = $state(false);
	let container: Element | null = $state(null);

	function handleClickOutside(event: MouseEvent) {
		if (container && !container.contains(event.target as Node)) {
			isOpen = false;
		}
	}

	$effect(() => {
		if (isOpen) {
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		}
	});
</script>

<!-- Navigation bar -->
<div class="absolute left-0 top-0 w-full bg-secondary-blue/80 py-4 shadow-xl">
	<div class="flex justify-between px-40">
		<a href="/home" title="Ir a inicio">
			<div class="flex items-center gap-x-2">
				<img alt="El logo de MarsalLab" src={icon} width="70" height="70" />
				<p class="font-bold">Lab Marsal</p>
			</div>
		</a>
		<!-- Dropdown container -->
		<div class="relative inline-flex items-center" bind:this={container}>
			<!-- TODO: Use the reusable button -->
			<button
				in:fly={{ x: -300 }}
				out:fly={{ x: -300 }}
				onclick={() => (isOpen = !isOpen)}
				class="flex items-center gap-x-2 rounded-lg bg-primary-blue px-4 py-2 text-white hover:bg-primary-blue/80"
			>
				<span>
					{fullName}
				</span>
				<span class={['mt-[2px] transition-transform duration-200', { 'rotate-180': isOpen }]}>
					<Icon src={ChevronDown} size="18" />
				</span>
			</button>

			{#if isOpen}
				<div
					class="absolute right-0 top-full select-none rounded border border-secondary-blue bg-gray-200 p-1 text-center shadow-lg"
					in:slide
					out:slide
				>
					<p class="m-2 text-primary-gray">{email}</p>
					<hr class="border-1 border-primary-gray" />

					<div
						class="my-1 inline-flex w-full cursor-pointer items-center justify-end gap-x-2 rounded px-4 py-2 hover:bg-secondary-blue"
					>
						<p>Mi perfil</p>
						<Icon src={UserCircle} size="24" />
					</div>

					<div
						class="inline-flex w-full cursor-pointer items-center justify-end gap-x-2 rounded px-4 py-2 hover:bg-secondary-blue"
					>
						<p>Cerrar sesión</p>
						<Icon src={Logout} size="24" />
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
