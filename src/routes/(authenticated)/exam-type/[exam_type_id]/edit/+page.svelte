<script lang="ts">
	import type { PageProps } from './$types';
	import Button from '$lib/components/Button.svelte';
	import { fade } from 'svelte/transition';
	import { sortArrayObject } from '$lib/shared/utils';
	import DisplayExamTypeParams from '$lib/components/DisplayExamTypeParams.svelte';
	import { generatePDF } from '$lib/client';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { PencilMinus } from '@steeze-ui/tabler-icons';

	let { data }: PageProps = $props();

	let { examTypeData } = data;
</script>
