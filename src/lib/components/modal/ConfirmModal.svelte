<script lang="ts">
	import BaseModal, { type PropType as BaseModalPropType } from './BaseModal.svelte';

	// Extend the BaseModalPropType to include the text prop and remove the children prop
	type PropType = Omit<
		BaseModalPropType & {
			text?: string;
			secondaryText?: string;
		},
		'children'
	>;

	let {
		title = 'Confirmar',
		text = '¿Estas seguro de que deseas continuar?',
		secondaryText,
		showModal = $bindable(),
		...data
	}: PropType = $props();
</script>

<!-- <BaseModal {title} bind:showModal {onClose} {onSave}> -->
<BaseModal {title} {...data} bind:showModal>
	<div class="flex flex-col space-y-4 px-8 py-2">
		<p class="text-lg font-medium">{text}</p>

		{#if secondaryText}
			<p>{secondaryText}</p>
		{/if}
	</div>
</BaseModal>
