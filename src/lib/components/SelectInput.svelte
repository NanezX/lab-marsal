<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import Svelecte from 'svelecte';

	type SvelecteProps = ComponentProps<typeof Svelecte>;
	type Options =
		| Array<{ label: string; value: string | number }>
		| Array<{ name: string; id: string | number }>;

	type PropType = Omit<SvelecteProps, 'options'> & {
		options: Options;
	};

	let {
		value = $bindable(),
		listHeader: listHeaderPassed,
		createRow: createRowPassed,
		placeholder = 'Seleccionar',
		// selection,
		creatable,
		disabled,

		...rest
	}: PropType = $props();

	const controlClass =
		'focus-within:!ring-dark-blue !rounded-3xl !border !py-[2.5px] !px-2 focus-within:!outline-hidden focus-within:!ring-1 !ring-1 !ring-transparent !border-r-8 !border-transparent';
</script>

<!-- These are the default snippets -->
{#snippet listHeader()}
	<p class="ml-2 cursor-default py-1 text-gray-400">
		Seleccionar opción {creatable && 'o escribe una nueva'}
	</p>
{/snippet}

{#snippet createRow(_isCreating: boolean, inputValue: string, _: unknown)}
	<div
		title="Crear {inputValue}"
		class="group w-full cursor-pointer rounded bg-blue-100 p-1 hover:bg-blue-200"
	>
		<p class="w-full bg-blue-100 text-start group-hover:bg-blue-200">Crear: "{inputValue}"</p>
	</div>
{/snippet}

{#snippet selection(selectedOptions: any, _: unknown)}
	{#each selectedOptions as option}
		<div class={['', { ' text-gray-600': disabled }]}>
			{#if 'id' in option}
				{option.name}
			{:else}
				{option.label}
			{/if}
		</div>
	{/each}
{/snippet}

<!-- 
controlClass="!bg-red-500"
dropdownClass="!bg-green-500"
optionClass="" 
-->
<!-- !bg-[#81d4e7]/30 -->
<Svelecte
	controlClass={`${controlClass} ${disabled ? '!cursor-not-allowed !bg-gray-200' : '!cursor-pointer !bg-secondary-blue/30'}`}
	dropdownClass="!rounded-lg !border !p-[1px] !bg-[#d9f2f8]"
	optionClass="!rounded !bg-[#d9f2f8] hover:!bg-[#BFD6DB]"
	bind:value
	{disabled}
	{placeholder}
	{creatable}
	clearable
	{selection}
	listHeader={listHeaderPassed ?? listHeader}
	createRow={createRowPassed ?? createRow}
	{...rest}
/>
