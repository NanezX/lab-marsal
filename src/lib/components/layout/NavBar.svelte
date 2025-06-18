<script lang="ts">
	import { slide } from 'svelte/transition';
	import icon from '$lib/assets/icon.png';
	import { ChevronDown, UserCircle, Logout } from '@steeze-ui/tabler-icons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { clickedOutside } from '../actions/clickedOutside';
	import Button from '../Button.svelte';
	import UserDropdown from '../dropdown/UserDropdown.svelte';
	import type { UserRoles } from '$lib/shared/enums';
	import { getUserContext } from '$lib/client/context';

	const { email, firstName, lastName } = getUserContext();

	let isOpen = $state(false);
</script>

<!-- Navigation bar -->
<div class="border-b-primary-blue/60 bg-secondary-blue/80 w-full border-b py-4 shadow-xl">
	<div class="mx-auto flex w-[80%] justify-between px-40">
		<!-- Home App Icon -->
		<a href="/home" title="Ir a inicio">
			<div class="flex items-center gap-x-2">
				<img alt="El logo de MarsalLab" src={icon} width="70" height="70" />
				<p class="text-xl font-bold">LabMarsal</p>
			</div>
		</a>

		<!-- Dropdown container -->
		<UserDropdown />
	</div>
</div>
