<script lang="ts">
	import { Icon, type IconSource } from '@steeze-ui/svelte-icon';

	type PropType = { type?: 'text' | 'password'; disabled?: boolean; icon?: IconSource };

	const { type = 'text', disabled = false, icon }: PropType = $props();
	// 'w-4/5 w-full rounded-md border border-gray-300 bg-white px-3 py-2
	// text-right text-black outline-none [appearance:textfield]
	// [&::-webkit-inner-spin-button]:appearance-none'

	// disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-600
</script>

{#if icon}
	<div class="relative flex items-center">
		<input
			type="text"
			placeholder="Correco electronico"
			class="bg-secondary-blue/30 w-full rounded-3xl border py-2 pl-10 pr-4 focus:outline-none focus:ring focus:ring-blue-500"
		/>
		<Icon src={icon} class="text-primary-blue/50 absolute ml-4 h-5 w-5" />
	</div>
{:else}
	<!-- else content here -->
	<p>Input without icon</p>
{/if}
