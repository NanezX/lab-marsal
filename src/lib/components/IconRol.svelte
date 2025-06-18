<script lang="ts">
	import { UserRoles } from '$lib/shared/enums';
	import {
		ShieldOutline,
		MicroscopeOutline,
		SeedlingOutline,
		FolderOutline
	} from 'flowbite-svelte-icons';
	import type { ClassValue } from 'svelte/elements';

	// Prop type
	type PropType = {
		role: UserRoles;
		class?: ClassValue;
	};

	let { role, class: className = 'text-primary-blue h-5 w-5' }: PropType = $props();

	const IconRoles: Record<string, typeof ShieldOutline> = {
		[UserRoles.Admin]: ShieldOutline,
		[UserRoles.Auxiliar]: SeedlingOutline,
		[UserRoles.Bioanalista]: MicroscopeOutline,
		[UserRoles.Secretaria]: FolderOutline
	};

	const C = IconRoles[role];
</script>

<C class={className} />
