<script lang="ts">
	import { slide, fly } from 'svelte/transition';
	import icon from '$lib/assets/icon.png';

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
				<img alt="El logo de MarsalLab" src={icon} width="50" height="50" />
				<p class="font-bold">Lab Marsal</p>
			</div>
		</a>
		<!-- Dropdown container -->
		<div class="relative inline-flex items-center" bind:this={container}>
			<button
				in:fly={{ x: -300 }}
				out:fly={{ x: -300 }}
				onclick={() => (isOpen = !isOpen)}
				class="rounded-lg bg-primary-blue px-4 py-2 text-white"
			>
				Victor Alfonzo Hernandez Jimenez
			</button>

			{#if isOpen}
				<div
					class="absolute right-0 top-full rounded border border-primary-blue bg-secondary-blue shadow-lg"
					in:slide
					out:slide
				>
					<p class="cursor-pointer px-4 py-2 hover:bg-primary-blue">Perfil</p>
					<p class="cursor-pointer px-4 py-2 hover:bg-primary-blue">Cerrar sesión</p>
				</div>
			{/if}
		</div>
	</div>
</div>
