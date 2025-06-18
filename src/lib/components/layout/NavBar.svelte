<script lang="ts">
	import icon from '$lib/assets/icon.png';
	import UserDropdown from '../dropdown/UserDropdown.svelte';
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
