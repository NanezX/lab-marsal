<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import FilterControls from '$lib/components/FilterControls.svelte';
	import Link from '$lib/components/Link.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import Select from '$lib/components/Select.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import {
		Dots,
		DotsCircleHorizontal,
		Edit,
		Pencil,
		Trash,
		UserPlus
	} from '@steeze-ui/tabler-icons';
	import { fade } from 'svelte/transition';
	import { Button as DropdownButton, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { removeStyleButton } from '$lib/client/customClasses.js';
	let { data } = $props();

	const orderByOptions = [
		{ value: 'fullName', label: 'Nombre' },
		{ value: 'documentId', label: 'CI del usuario' },
		{ value: 'email', label: 'Correo (@)' }
	];

	let textSearch = $state(page.url.searchParams.get('search') || '');
	let orderBy = $state(page.url.searchParams.get('orderBy') || orderByOptions[0].value);

	function getUsers() {
		goto(`/users?search=${textSearch}&orderBy=${orderBy}`, {
			keepFocus: true
		});
	}
</script>

<div in:fade class="flex w-full flex-col gap-y-8">
	<p class="text-center text-3xl">Gestión de usuarios</p>

	<div class="flex w-full flex-col justify-evenly gap-x-2 xl:flex-row">
		<SearchBar
			id="searchExamType"
			bind:inputSearch={textSearch}
			placeholder="Buscar por nombre o cédula"
			wrapperClass="w-full min-w-1/10 mt-5"
			debounceTime={500}
			debounceCallback={() => {}}
		/>

		<div class="flex w-fit flex-col items-start justify-center gap-x-2">
			<p id="orderBy" class="w-fit text-sm font-semibold">Ordenar por:</p>
			<Select
				id="orderBy"
				bind:value={orderBy}
				items={orderByOptions}
				name="orderBy"
				required
				placeholder="Ordenar por"
				class="!w-fit"
				onchange={getUsers}
			/>
		</div>

		<Link
			href="/register"
			title="Nuevo usuario"
			class="mt-5 flex items-center justify-center gap-x-1 transition-all hover:-translate-y-0.25 hover:shadow-lg"
		>
			<span> Nuevo </span>
			<Icon src={UserPlus} size="24" class=" text-white" />
		</Link>
	</div>

	<div class="flex flex-col gap-y-4">
		<!-- Pagination -->
		<FilterControls
			baseUrl="/users"
			totalItems={data.countTotal}
			pageSize={12}
			bind:queryParams={
				() => {
					return { search: textSearch, orderBy };
				},
				(v) => {
					textSearch = v['search'];
					orderBy = v['orderBy'];
				}
			}
		/>

		<!-- <div class="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-3"> -->
		<div class="mt-4 overflow-x-auto">
			<table class="w-full table-fixed border-collapse text-sm">
				<thead>
					<tr class="text-left font-semibold underline">
						<th class="w-[25%] py-2">Nombre</th>
						<th class="w-[16%] py-2">Cédula</th>
						<th class="w-[35%] py-2">Correo</th>
						<th class="w-[14%] py-2">Rol</th>
						<th class="w-[8%] py-2">Estado</th>
						<th class="w-[12%] py-2"></th>
					</tr>
				</thead>

				<tbody>
					{#each data.usersData as user}
						<tr class="border-b transition hover:bg-slate-100">
							<td class="font-medim py-2 break-all">{user.firstName} {user.lastName}</td>
							<td class="py-2">{user.documentId}</td>
							<td class="py-2 break-all">{user.email}</td>
							<td class="py-2 capitalize">{user.role}</td>
							<td class="py-2 text-green-600">Activo</td>

							<td class="flex h-full items-stretch justify-center py-2">
								<DropdownButton
									class={`${removeStyleButton} !flex h-full w-full items-center justify-center `}
								>
									<Icon
										src={DotsCircleHorizontal}
										title="Opciones"
										size="18"
										class="hover:text-primary-blue mx-auto cursor-pointer text-black"
									/>
								</DropdownButton>

								<Dropdown simple>
									<DropdownItem
										title="Editar usuario"
										class="flex cursor-pointer items-center gap-x-0.5"
										onclick={() => alert(`Editar "${user.firstName} ${user.lastName}"`)}
									>
										<span>
											<Icon src={Pencil} size="18" class="text-green-500" />
										</span>
										<span>Editar</span>
									</DropdownItem>
									<DropdownItem
										title="Eliminar usuario"
										class="flex cursor-pointer items-center gap-x-0.5"
									>
										<span>
											<Icon src={Trash} size="18" class="text-red-500" />
										</span>
										<span>Eliminar</span>
									</DropdownItem>
								</Dropdown>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Pagination -->
		<FilterControls
			baseUrl="/users"
			totalItems={data.countTotal}
			pageSize={12}
			bind:queryParams={
				() => {
					return { search: textSearch, orderBy };
				},
				(v) => {
					textSearch = v['search'];
					orderBy = v['orderBy'];
				}
			}
		/>
	</div>
</div>
