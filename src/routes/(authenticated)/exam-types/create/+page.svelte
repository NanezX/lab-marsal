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
		//
		baseParameters.push({ position: baseParameters.length + 1 });
	}

	let mouseYCoordinate: any = $state(null); // pointer y coordinate within client
	let distanceTopGrabbedVsPointer: any = $state(null);

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
		//console.log('dragstart', mouseYCoordinate);

		draggingItem = param;
		draggingItemIndex = index;
		draggingItemId = param.position;
		console.log('all');

		if (e.target) {
			console.log('all22');
			// @ts-expect-error asfjasf
			distanceTopGrabbedVsPointer = e.target.getBoundingClientRect().y - e.clientY;
		}
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
			// swap items
			[baseParameters[draggingItemIndex], baseParameters[hoveredItemIndex]] = [
				baseParameters[hoveredItemIndex],
				baseParameters[draggingItemIndex]
			];

			// balance
			draggingItemIndex = hoveredItemIndex;
		}

		draggingItemId = null; // makes item visible
		hoveredItemIndex = null; // prevents instant swap
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
					<p
						draggable="true"
						transition:fade
						animate:flip={{ duration: 500 }}
						id={index.toString()}
						class="cursor-grab rounded-xl bg-red-300 px-4 py-2"
						ondrag={onDrag}
						ondragstart={(e) => onDragStart(e, param, index)}
						ondragover={() => onDragOver(index)}
						ondragend={(e) => onDragEnd()}
					>
						Position: {param.position}
					</p>
				{/each}
			</div>

			<div class="space-y-4">
				<Input bind:value={examName} name="name" placeholder="Nombre del exámen" />
			</div>
		</div>

		<Button type="submit">Click me</Button>
	</div>
</div>
