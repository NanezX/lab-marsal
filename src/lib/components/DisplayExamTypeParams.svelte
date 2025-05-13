<script lang="ts">
	import type { Parameter } from '$lib/shared/types';
	import { formatCapital } from '$lib/shared/utils';
	import type { ClassValue } from 'svelte/elements';

	// Prop type
	type PropType = {
		class?: ClassValue;
		params: Array<Parameter>;
	};

	let { params, class: enteredClass }: PropType = $props();
</script>

<div class="overflow-hidden">
	<table class={['w-full text-left', enteredClass]}>
		<thead>
			<tr class="direct-children:font-semibold direct-children:py-1 underline">
				<th class="w-2/5" scope="col"> Nombre </th>
				<th class="w-3/5" scope="col"> Referencia </th>
			</tr>
		</thead>

		<tbody class="">
			{#each params as parameter_, i}
				<tr
					class="direct-children:font-normal direct-children:pb-2 border-primary-gray/20 not-last:border-b"
				>
					<th scope="row" class="w-2/5">
						<p>
							{parameter_.name}
						</p>
					</th>

					<th scope="row" class="w-3/5">
						{#if parameter_.hasReferences}
							{#each parameter_.referenceValues as reference_}
								<p>{formatCapital(reference_)}</p>
							{/each}
						{:else}
							<p>N/A</p>
						{/if}
					</th>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
