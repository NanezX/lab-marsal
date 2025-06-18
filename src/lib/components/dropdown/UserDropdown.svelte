<script lang="ts">
	import {
		Button,
		Dropdown,
		DropdownItem,
		Avatar,
		DropdownHeader,
		DropdownGroup
	} from 'flowbite-svelte';
	import autoAnimate from '@formkit/auto-animate';
	import { slide } from 'svelte/transition';

	// Prop type
	type PropType = {
		firstName: string;
		lastName: string;
	};

	let { firstName, lastName }: PropType = $props();
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
	</Button>

	<Dropdown
		triggeredBy="#avatar_with_name"
		simple
		transition={slide}
		transitionParams={{ duration: 500 }}
	>
		<DropdownHeader>
			<span class="block text-sm text-gray-900 dark:text-white">Bonnie Green</span>
			<span class="block truncate text-sm font-medium">name@flowbite.com</span>
		</DropdownHeader>
		<DropdownGroup>
			<DropdownItem>Dashboard</DropdownItem>
			<DropdownItem>Settings</DropdownItem>
			<DropdownItem>Earnings</DropdownItem>
		</DropdownGroup>
		<DropdownHeader>Sign out</DropdownHeader>
	</Dropdown>
</div>
