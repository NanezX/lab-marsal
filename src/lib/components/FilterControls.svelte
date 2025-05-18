<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { ArrowLeft, ArrowRight } from '@steeze-ui/tabler-icons';

	// Prop type
	type PropType = {
		baseUrl: string;
		currentPage: number;
		pageSize: number;
		totalPages: number;
		queryParams: Record<string, string | number>;
	};

	let {
		baseUrl,
		currentPage = $bindable(),
		pageSize = $bindable(),
		totalPages = $bindable(),
		queryParams = $bindable()
	}: PropType = $props();

	function generateHref(skipMultiplier: number): string {
		const params = {
			...queryParams,
			limit: pageSize.toString(),
			skip: (skipMultiplier * pageSize).toString()
		};

		const queryString = new URLSearchParams(params).toString();
		return `${baseUrl}?${queryString}`;
	}
</script>

<div
	class="direct-children:hover:text-blue-700 direct-children:hover:underline mx-auto flex w-fit items-center gap-x-2 text-lg font-semibold"
>
	<!-- Back -->
	<a
		title="Anterior"
		href={generateHref(currentPage - 1)}
		class={[
			'mt-0.5',
			{
				'pointer-events-none opacity-50': currentPage === 0
			}
		]}
	>
		<Icon src={ArrowLeft} size="20" />
	</a>

	<!-- Pagination Numbers (Example for pages 1, 2, 3, 4) -->
	{#each Array(totalPages) as _, page}
		<a
			href={generateHref(page)}
			class={{
				'text-blue-700 underline': currentPage === page
			}}
		>
			{page + 1}
		</a>
	{/each}

	<!-- Forward -->
	<a
		title="Siguiente"
		href={generateHref(currentPage + 1)}
		class={[
			'mt-0.5',
			{
				'pointer-events-none opacity-50': totalPages < 1 || currentPage === totalPages - 1
			}
		]}
	>
		<Icon src={ArrowRight} size="20" />
	</a>
</div>
