<script lang="ts">
	import Exponents from './Exponents.svelte';

	const base = 10;
	const exponents = [3, 6];
</script>

<div class="bg-secondary-gray/25 space-y-1 rounded-xl border border-gray-300 px-4 py-2 text-sm">
	<p>Unidades de ayuda (Click para copiar):</p>
	{#each exponents as exponent}
		<Exponents {base} {exponent} />
	{/each}
</div>
