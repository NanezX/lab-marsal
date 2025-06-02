<script lang="ts">
	import { ExamStatus, ExamPriority } from '$lib/shared/enums';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Cancel, CircleCheck, CircleChevronsUp, CircleMinus } from '@steeze-ui/tabler-icons';
	import type { ClassValue } from 'svelte/elements';

	type PropType = {
		status: ExamStatus;
		priority: ExamPriority;
		minimal?: boolean;
		class?: ClassValue;
	};

	let { status, priority, minimal = true, class: className }: PropType = $props();
</script>

{#if minimal}
	<p class={['flex items-center gap-x-1', className]}>
		<span>
			{status == ExamStatus.Active
				? 'En proceso'
				: status == ExamStatus.Completed
					? 'Completado'
					: 'Cancelado'}
		</span>

		<span>
			{#if status == ExamStatus.Active}
				<Icon
					src={priority == ExamPriority.High ? CircleChevronsUp : CircleMinus}
					size="22"
					class={{
						'text-yellow-300': priority == ExamPriority.Low,
						'text-blue-300': priority == ExamPriority.Normal,
						'text-red-400': priority == ExamPriority.High
					}}
				/>
			{:else if status == ExamStatus.Cancelled}
				<Icon src={Cancel} size="22" class="text-red-500" />
			{:else}
				<!-- else content here -->
				<Icon src={CircleCheck} size="22" class="text-green-400" />
			{/if}
		</span>
	</p>
{:else}
	<!-- else content here -->
{/if}
