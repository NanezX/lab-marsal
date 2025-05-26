<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { fade } from 'svelte/transition';
	import BackButton from '$lib/components/buttons/BackButton.svelte';
	import Input from '$lib/components/Input.svelte';
	import { formatCapital } from '$lib/shared/utils.js';
	import Select from '$lib/components/Select.svelte';
	import { PatientGender } from '$lib/shared/enums.js';
	import Button from '$lib/components/Button.svelte';
	import Link from '$lib/components/Link.svelte';
	import { enhance } from '$app/forms';

	let { data } = $props();

	// let { createExamForm } = data;

	// const { form, errors, constraints, enhance } = superForm(createExamForm, {
	// 	dataType: 'json',
	// 	delayMs: 0,
	// 	applyAction: true
	// });
</script>


<form in:fade class="mb-4 flex w-full flex-col gap-y-8" use:enhance method="POST">
    //
</form>
