<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Textarea from '$lib/components/Textarea.svelte';
	import { fade } from 'svelte/transition';
	import type { ExamParemeterInput } from './params';
	import { isObject } from 'lodash-es';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { CirclePlus } from '@steeze-ui/tabler-icons';

	let examName = $state('');
	let examDescription = $state('');
	let basePrice = $state('');

	type ParameterData = {
		position: number;
		parameter: ExamParemeterInput;
	};

	let baseParameteers: ParameterData[] = $state([]);
</script>

<div in:fade class="flex w-full flex-col gap-y-8">
	<p class="text-center text-3xl">Crear tipo de exámen</p>

	<div>
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

					<Input
						value={examName}
						name="basePrice"
						placeholder="Precio base referencia"
						wrapperClass="w-1/3"
					/>
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
			<div class="just flex items-center gap-x-2 text-xl">
				<p>Valores y parámetros</p>

				<Button
					class="!bg-inherit !p-0"
					title="Añadir parámetro nuevo"
					onclick={() => alert('new param')}
				>
					<Icon
						src={CirclePlus}
						size="32"
						class="text-primary-blue hover:text-primary-blue/75"
						theme="filled"
					/>
				</Button>
			</div>

			<div class="space-y-4">
				<Input bind:value={examName} name="name" placeholder="Nombre del exámen" />
			</div>
		</div>

		<Button type="submit">Click me</Button>
	</div>
</div>
