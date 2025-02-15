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

	let draggingItemIndex: number | null = $state(null);

	let hoveredItemIndex: any = $state(null);
	let container: HTMLDivElement | null = $state(null);
	let isOutside = $state(false);

	type DragEventFn = DragEvent & {
		currentTarget: EventTarget & HTMLParagraphElement;
	};

	function onDragStart(e: DragEventFn, param: ParameterData, index: number) {
		draggingItemIndex = index;
	}

	function onDragOver(event: DragEventFn, index: number) {
		hoveredItemIndex = index;
	}

	function onDragEnd() {
		if (
			draggingItemIndex != null &&
			hoveredItemIndex != null &&
			draggingItemIndex != hoveredItemIndex &&
			!isOutside
		) {
			// Reorganzize items
			[baseParameters[draggingItemIndex], baseParameters[hoveredItemIndex]] = [
				baseParameters[hoveredItemIndex],
				baseParameters[draggingItemIndex]
			];

			// Balance
			draggingItemIndex = hoveredItemIndex;
		}

		hoveredItemIndex = null;
	}

	function windowOnDragOver(
		e: DragEvent & {
			currentTarget: EventTarget & Window;
		}
	) {
		// Get the target element under the mouse
		const target = e.target;
		// const target = e.target as HTMLElement;

		if (target) {
			// If the target is NOT inside the container, set isOutside to true
			if (!(target as HTMLElement).closest('.drag-container')) {
				isOutside = true;
				return;
			}
		}
		isOutside = false;
	}
</script>

<!-- To control when the drag ends outside of th drag container -->
<svelte:window ondragover={windowOnDragOver} />

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

			<div
				role="definition"
				class="drag-container space-y-4 rounded-lg border border-gray-200 px-1"
				bind:this={container}
			>
				{#each baseParameters as param, index (param)}
					<div
						class="flex items-center gap-x-2"
						transition:fade
						animate:flip={{ duration: 500 }}
						id={index.toString()}
					>
						<!-- Drag handle area -->
						<div
							role="button"
							tabindex="0"
							aria-label="Drag handle for parameter {param.position}"
							class="cursor-grab rounded-xl p-1 hover:bg-gray-100"
							draggable="true"
							ondragstart={(e) => onDragStart(e, param, index)}
							ondragend={() => onDragEnd()}
						>
							<svg
								class="h-6 w-6 text-gray-400"
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
							class="w-full"
							role="listitem"
							aria-label="List of exam parameters"
							ondragover={(e) => onDragOver(e, index)}
						>
							<p class="w-full rounded-lg p-4">
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
