<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	type PropType = {
		shouldBlock: () => boolean;
		onBlock: (continueNav: () => void) => void;
	};

	let { shouldBlock, onBlock }: PropType = $props();

	let isConfirmed = $state(false);

	let nextUrl: string | null = null;

	function confirmedNavigation() {
		if (nextUrl) {
			isConfirmed = true;
			goto(nextUrl);
			nextUrl = null;
		}
	}

	onMount(() => {
		const unsubscribe = beforeNavigate((nav) => {
			if (shouldBlock() && !isConfirmed && nav.to?.url) {
				nav.cancel(); // stop the navigation
				nextUrl = nav.to.url.pathname + nav.to.url.search + nav.to.url.hash;

				// Execute the onBlock function passed as a prop
				onBlock(confirmedNavigation);
			}
		});

		return unsubscribe;
	});
</script>
