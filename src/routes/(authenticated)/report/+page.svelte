<!-- src/routes/charts/+page.svelte -->
<script lang="ts">
	import Chart from '$lib/components/Chart.svelte';

	export let data;

	const { chartData } = data;

	// Exam Types Chart
	$: examTypesChart = {
		labels: chartData.examTypesData.map((item) => item.name),
		datasets: [
			{
				data: chartData.examTypesData.map((item) => item.count),
				backgroundColor: [
					'#FF6384',
					'#36A2EB',
					'#FFCE56',
					'#4BC0C0',
					'#9966FF',
					'#FF9F40',
					'#8AC24A',
					'#607D8B',
					'#E91E63',
					'#9C27B0'
				],
				borderWidth: 1
			}
		]
	};

	// Age Groups Chart
	$: ageGroupsChart = {
		labels: chartData.ageGroups.map((group) => group.label),
		datasets: [
			{
				label: 'Pacientes por grupo de edad',
				data: chartData.ageGroups.map((group) => group.count),
				backgroundColor: '#4BC0C0',
				borderWidth: 1
			}
		]
	};

	$: ageOptions = {
		responsive: true,
		scales: {
			y: {
				beginAtZero: true,
				title: {
					display: true,
					text: 'Número de pacientes'
				}
			},
			x: {
				title: {
					display: true,
					text: 'Grupo de edad'
				}
			}
		}
	};
</script>

<div class="dashboard">
	<p class="text-center text-3xl">Reporte estadístico</p>

	<div class="flex gap-x-4">
		<div class="chart-container">
			<h2 class="font-bold">Tipos de exámen solicitados en el último mes</h2>
			<div class="chart-wrapper">
				<Chart type="pie" data={examTypesChart} />
			</div>
		</div>

		<div class="chart-container flex flex-col">
			<h2 class="font-bold">Grupos de edad de los pacientes en el último mes</h2>
			<div class="chart-wrapper">
				<Chart type="bar" data={ageGroupsChart} options={ageOptions} />
			</div>
		</div>
	</div>
</div>

<style>
	.dashboard {
		max-width: 1000px;
		margin: 0 auto;
		padding: 2rem;
	}

	h1 {
		color: #2c3e50;
		margin-bottom: 2rem;
		text-align: center;
	}

	.chart-container {
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		padding: 1.5rem;
		margin-bottom: 2rem;
	}

	h2 {
		color: #34495e;
		margin-bottom: 1rem;
	}

	.chart-wrapper {
		height: fit-content;
		position: relative;
		margin-top: auto;
		margin-bottom: auto;
	}
</style>
