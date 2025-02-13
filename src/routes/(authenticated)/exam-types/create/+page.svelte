<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Textarea from '$lib/components/Textarea.svelte';
	import { fade } from 'svelte/transition';

	let examName = $state('');
	let examDescription = $state('');
	let basePrice = $state('');
</script>

<div in:fade class="flex w-full flex-col gap-y-8">
	<p class="text-center text-3xl">Crear tipo de exámen</p>

	<form method="POST">
		<div class="space-y-5">
			<p class="text-xl">Detalles generales</p>

			<div class="space-y-4">
				<div class="flex gap-x-8">
					<Input
						bind:value={examName}
						name="name"
						placeholder="Nombre del exámen"
						wrapperClass="w-1/2"
					/>

					<Input value={examName} name="basePrice" placeholder="Precio base" wrapperClass="w-1/3" />
				</div>
				<Textarea
					bind:value={examDescription}
					name="description"
					placeholder="Description del exámen"
				/>
			</div>
		</div>

		<hr class="border-primary-gray/50 my-4" />

		<div class="space-y-5">
			<p class="text-xl">Valores y parámetros</p>

			<div class="space-y-4">
				<Input bind:value={examName} name="name" placeholder="Nombre del exámen" />
			</div>
		</div>

		<Button type="submit">Click me</Button>
	</form>
</div>
