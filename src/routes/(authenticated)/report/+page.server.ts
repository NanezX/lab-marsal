// src/routes/charts/+page.server.ts
import { getChartData } from '$lib/server/chartData';

export async function load() {
	const chartData = await getChartData();

	return { chartData };
}
