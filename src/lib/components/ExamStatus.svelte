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

	const statusLabel = {
		[ExamStatus.Active]: 'En proceso',
		[ExamStatus.Completed]: 'Completado',
		[ExamStatus.Cancelled]: 'Cancelado'
	}[status];

	const priorityLabel = {
		[ExamPriority.High]: 'Alta prioridad',
		[ExamPriority.Normal]: 'Prioridad normal',
		[ExamPriority.Low]: 'Baja prioridad'
	}[priority];

	const statusIcon = {
		[ExamStatus.Active]: priority === ExamPriority.High ? CircleChevronsUp : CircleMinus,
		[ExamStatus.Completed]: CircleCheck,
		[ExamStatus.Cancelled]: Cancel
	}[status];

	const statusColor =
		status === ExamStatus.Active
			? priority === ExamPriority.High
				? 'text-red-500'
				: priority === ExamPriority.Normal
					? 'text-blue-500'
					: 'text-yellow-500'
			: status === ExamStatus.Completed
				? 'text-green-500'
				: 'text-red-600';
</script>

{#if minimal}
	<p class={['flex items-center gap-x-2', className]}>
		<span>{statusLabel}</span>
		<Icon
			src={statusIcon}
			size="22"
			class={statusColor}
			title={`${statusLabel} - ${priorityLabel}`}
		/>
	</p>
{:else}
	<p
		class={['flex items-center gap-x-2 rounded-md px-2 py-1 font-semibold', className, statusColor]}
		title={`${statusLabel} (${priorityLabel})`}
	>
		<Icon src={statusIcon} size="20" />
		<span>{statusLabel} ({priorityLabel})</span>
	</p>
{/if}
