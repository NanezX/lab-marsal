<script lang="ts">
	import { IconRoles } from '$lib/client';
	import { UserRoles } from '$lib/shared/enums';
	import { Icon } from '@steeze-ui/svelte-icon';
	import type { ClassValue } from 'svelte/elements';

	// Prop type
	type PropType = {
		role: UserRoles;
		class?: ClassValue;
	};

	let { role, class: className = 'text-primary-blue h-5 w-5' }: PropType = $props();
</script>

<Icon src={IconRoles[role]} class={className} title={role} />
