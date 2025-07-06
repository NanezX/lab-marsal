<!-- src/lib/components/Chart.svelte -->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Chart, registerables } from 'chart.js';
	import type { ChartType, ChartData, ChartOptions } from 'chart.js';

	export let type: ChartType;
	export let data: ChartData;
	export let options: ChartOptions = { responsive: true };

	let chart: Chart;
	let canvas: HTMLCanvasElement;

	onMount(() => {
		Chart.register(...registerables);
		const ctx = canvas.getContext('2d');
		if (ctx) {
			chart = new Chart(ctx, {
				type,
				data,
				options
			});
		}
	});

	onDestroy(() => {
		if (chart) {
			chart.destroy();
		}
	});
</script>

<canvas bind:this={canvas} />
