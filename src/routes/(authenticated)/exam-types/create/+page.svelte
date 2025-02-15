<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Textarea from '$lib/components/Textarea.svelte';
	import { fade } from 'svelte/transition';
	import type { ExamParemeterInput } from './params';
	import { isObject } from 'lodash-es';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { CirclePlus } from '@steeze-ui/tabler-icons';
	import AddButton from '$lib/components/buttons/AddButton.svelte';
	import { flip } from 'svelte/animate';

	let examName = $state('');
	let examDescription = $state('');
	let basePrice = $state('');

	type ParameterData = {
		position: number;
		parameter?: ExamParemeterInput;
	};

	let baseParameters: ParameterData[] = $state([
		{ position: 1 },
		{ position: 2 },
		{ position: 3 },
		{ position: 4 }
	]);

	function addParameter() {
		baseParameters.push({ position: baseParameters.length + 1 });
	}

	let mouseYCoordinate: any = $state(null);

	let draggingItem: any = $state(null);
	let draggingItemId: any = $state(null);
	let draggingItemIndex: any = $state(null);

	let hoveredItemIndex: any = $state(null);
	let container: any = $state(null);

	type DragEventFn = DragEvent & {
		currentTarget: EventTarget & HTMLParagraphElement;
	};

	function onDrag(e: DragEventFn) {
		mouseYCoordinate = e.clientY;
	}

	function onDragStart(e: DragEventFn, param: ParameterData, index: number) {
		mouseYCoordinate = e.clientY;
		draggingItem = param;
		draggingItemIndex = index;
		draggingItemId = param.position;
	}

	function onDragOver(index: number) {
		hoveredItemIndex = index;
	}

	function onDragEnd() {
		if (
			draggingItemIndex != null &&
			hoveredItemIndex != null &&
			draggingItemIndex != hoveredItemIndex
		) {
			// Reorganzize items
			[baseParameters[draggingItemIndex], baseParameters[hoveredItemIndex]] = [
				baseParameters[hoveredItemIndex],
				baseParameters[draggingItemIndex]
			];

			// Balance
			draggingItemIndex = hoveredItemIndex;
		}

		draggingItemId = null;
		hoveredItemIndex = null;
	}
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
				<AddButton title="Añadir parámetro nuevo" onclick={addParameter} theme="filled" />
			</div>

			<div class="space-y-4" bind:this={container}>
				{#each baseParameters as param, index (param)}
					<div
						class="group relative"
						transition:fade
						animate:flip={{ duration: 500 }}
						id={index.toString()}
					>
						<!-- Drag handle area -->
						<div
							role="button"
							tabindex="0"
							aria-label="Drag handle for parameter {param.position}"
							class="absolute top-1/2 left-0 h-full w-6 -translate-y-1/2 cursor-grab opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-100"
							draggable="true"
							ondrag={onDrag}
							ondragstart={(e) => onDragStart(e, param, index)}
							ondragend={(e) => onDragEnd()}
						>
							<svg
								class="h-4 w-4 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						</div>

						<!-- Content area -->
						<div
							role="listitem"
							aria-label="List of exam parameters"
							class="pl-8"
							ondragover={(e) => onDragOver(index)}
						>
							<p class="rounded-lg bg-red-300 p-4">
								Position: {param.position}
							</p>
						</div>
					</div>
				{/each}
			</div>

			<div class="space-y-4">
				<Input bind:value={examName} name="name" placeholder="Nombre del exámen" />
			</div>
		</div>

		<Button type="submit">Click me</Button>
	</div>
</div>
