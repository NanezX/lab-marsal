<script>
	import Button from '$lib/components/Button.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { X } from '@steeze-ui/tabler-icons';
	import { blur } from 'svelte/transition';
	import { clickedOutside } from '../actions/clickedOutside';

	let { title = 'My title', showModal = $bindable(), children } = $props();

	function closeModal() {
		showModal = false;
	}
</script>

{#if showModal}
	<div
		transition:blur
		class="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-hidden focus:outline-hidden"
	>
		<div use:clickedOutside onclickedout={closeModal} class="relative mx-auto my-6 w-2/4 max-w-3xl">
			<!--content-->
			<div
				class="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-hidden focus:outline-hidden"
			>
				<!--header-->
				<div
					class="border-blueGray-200 flex items-start justify-between rounded-t border-b border-solid border-b-gray-200 p-5"
				>
					<h3 class="text-3xl font-semibold text-gray-600">
						{title}
					</h3>
					<button
						class="float-right ml-auto border-0 bg-transparent p-1 text-3xl leading-none font-semibold text-gray-500 outline-hidden hover:text-red-500 focus:outline-hidden"
						onclick={closeModal}
					>
						<Icon src={X} size="24" />
					</button>
				</div>

				<!--body-->
				<div class="relative flex-auto">
					{@render children()}
				</div>

				<!--footer-->
				<div
					class=" flex items-center justify-end gap-x-6 rounded-b border-t border-solid border-t-gray-200 p-6"
				>
					<Button class="bg-red-500 hover:bg-red-500/75" onclick={closeModal}>Cerrar</Button>
					<Button
						onclick={() => {
							alert('Guardar!');
							closeModal();
						}}>Guardar</Button
					>
				</div>
			</div>
		</div>
	</div>
	<div class="fixed inset-0 z-40 bg-black opacity-25"></div>
{/if}
