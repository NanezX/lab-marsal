<script lang="ts">
	import type { PageProps } from './$types';
	import Button from '$lib/components/Button.svelte';
	import { fade } from 'svelte/transition';

	let { data }: PageProps = $props();

	let { examTypeData } = data;
</script>

<div in:fade class="mb-4 flex w-full flex-col gap-y-8">
	<p class="text-center text-3xl">{examTypeData.name}</p>

	<div class="grid grid-cols-2 gap-2">
		<p>
			<strong> Precio: </strong>
			<span>{examTypeData.basePrice} $</span>
		</p>

		<p>
			<strong>Creado: </strong>
			<span>{examTypeData.createdAt.toLocaleString()}</span>
		</p>

		{#if examTypeData.createdAt.getTime() == examTypeData.updatedAt.getTime()}
			<p class="col-start-2">
				<strong>Última vez actualizado: </strong>
				<span>{examTypeData.updatedAt.toLocaleString()}</span>
			</p>
		{/if}
	</div>

	<p>
		<strong>Descripción: </strong><br />
		<span>{examTypeData.description}</span>
	</p>

	<Button onclick={() => console.log(examTypeData)}>xdd</Button>
</div>
