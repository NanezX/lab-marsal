<script lang="ts">
	import { generateRandomUUID } from '$lib/shared/uuid';
	import type { ClassValue } from 'svelte/elements';

	// Prop type
	type PropType = {
		value: boolean;
		text: string;
		name?: string;
		title?: string;
		disabled?: boolean;
		wrapperClass?: ClassValue;
	};

	let {
		value = $bindable(false),
		text,
		name,
		title,
		disabled = false,
		wrapperClass
	}: PropType = $props();

	let instanceId = generateRandomUUID();
</script>

<div class={['ml-auto flex w-fit items-center gap-x-2', wrapperClass]} {title}>
	<label class="relative flex cursor-pointer items-center" for={instanceId}>
		<input
			bind:checked={value}
			{name}
			{disabled}
			type="checkbox"
			class="peer checked:border-primary-blue checked:bg-primary-blue h-4 w-4 cursor-pointer appearance-none rounded-sm border border-slate-300 shadow-sm transition-all hover:shadow-md"
			id={instanceId}
		/>
		<span
			class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-white opacity-0 peer-checked:opacity-100"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-3.5 w-3.5"
				viewBox="0 0 20 20"
				fill="currentColor"
				stroke="currentColor"
				stroke-width="1"
			>
				<path
					fill-rule="evenodd"
					d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
					clip-rule="evenodd"
				></path>
			</svg>
		</span>
	</label>
	<label class="cursor-pointer text-sm select-none" for={instanceId}>{text}</label>
</div>
