<script lang="ts">
	import type { ClassValue } from 'svelte/elements';
	import Exponents from './Exponents.svelte';
	import { clickToCopy } from '../actions/clickToCopy';

	type PropType = { class?: ClassValue };

	let { class: className }: PropType = $props();

	const base = 10;
	const exponents = [3, 6];

	const commons = ['uL.', 'gr/dl', 'mg/dl', 'UL'];
</script>

<div
	class={[
		'bg-secondary-gray/25 space-y-1 rounded-xl border border-gray-300 px-4 py-2 text-base',
		className
	]}
>
	<p><strong>Unidades</strong> (Click para copiar)</p>

	<ul class="list-disc px-6 text-lg">
		{#each exponents as exponent, i (`notation-exp-${i}`)}
			<li>
				<Exponents {base} {exponent} />
			</li>
		{/each}

		{#each commons as item, i (`notation-common-${i}`)}
			<li class="cursor-pointer hover:underline" use:clickToCopy={item}>
				{item}
			</li>
		{/each}
	</ul>
</div>
