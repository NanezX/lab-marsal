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
	import { getUserContext } from '$lib/client/context';

	const { email, role, firstName, lastName } = getUserContext();

	let isOpen = $state(false);
</script>

<div class="relative inline-flex items-center">
	<Button
		pill
		color="light"
		id="avatar_with_name"
		class="bg-primary-blue hover:bg-primary-blue/75 !h-fit cursor-pointer gap-x-2 rounded-2xl border-0 !px-1 !py-1.5"
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
			<DropdownItem href="/account">Mi perfil</DropdownItem>

			<form id="logout-form" method="POST" action="/logout" class="hidden"></form>
			<DropdownItem
				onclick={() => {}}
				form="logout-form"
				type="submit"
				class="w-full cursor-pointer text-start"
			>
				Cerrar sesión
			</DropdownItem>
		</DropdownGroup>
	</Dropdown>
</div>
