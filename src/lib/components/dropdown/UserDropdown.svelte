<script lang="ts">
	import {
		Button,
		Dropdown,
		DropdownItem,
		Avatar,
		DropdownHeader,
		DropdownGroup,
		DropdownDivider
	} from 'flowbite-svelte';
	import { slide } from 'svelte/transition';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { ChevronDown } from '@steeze-ui/tabler-icons';
	import IconRol from '../IconRol.svelte';
	import type { UserRoles } from '$lib/shared/enums';

	// Prop type
	type PropType = {
		email: string;
		firstName: string;
		lastName: string;
		role: UserRoles;
	};

	let { email, firstName, lastName, role }: PropType = $props();

	let isOpen = $state(false);
</script>

<div class="relative inline-flex items-center">
	<Button
		pill
		color="light"
		id="avatar_with_name"
		class="bg-primary-blue hover:bg-primary-blue/75 !h-fit cursor-pointer gap-x-2 rounded-lg border-0 !px-1 !py-1.5"
	>
		<Avatar id="user-drop" size="sm">{firstName[0] + lastName[0]}</Avatar>

		<p class="text-white">{firstName} {lastName}</p>

		<span
			class={[
				'mt-[2px] mr-2 text-white transition-transform duration-200',
				{ 'rotate-180': isOpen }
			]}
		>
			<Icon src={ChevronDown} size="18" />
		</span>
	</Button>

	<Dropdown
		bind:isOpen
		triggeredBy="#avatar_with_name"
		simple
		transition={slide}
		transitionParams={{ duration: 500 }}
		class="border-primary-blue border"
	>
		<DropdownHeader class="cursor-default space-y-1">
			<span class="block text-sm text-gray-900 dark:text-white">{firstName} {lastName}</span>
			<span class="inline-flex gap-x-1 truncate text-sm font-medium capitalize">
				<span>
					{role}
				</span>
				<span>
					<IconRol {role} />
				</span>
			</span>
			<span class="block truncate text-sm font-medium">{email}</span>
		</DropdownHeader>
		<DropdownDivider class="bg-primary-gray/50" />

		<DropdownGroup>
			<DropdownItem>Dashboard</DropdownItem>
			<DropdownItem>Settings</DropdownItem>
			<DropdownItem>Earnings</DropdownItem>
		</DropdownGroup>
		<DropdownHeader>Sign out</DropdownHeader>
	</Dropdown>
</div>
