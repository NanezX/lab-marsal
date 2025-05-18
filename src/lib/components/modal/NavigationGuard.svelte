<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	type PropType = {
		shouldBlock: () => boolean;
		onBlock: (continueNav: () => void) => void;
	};

	let { shouldBlock, onBlock }: PropType = $props();

	let nextUrl: string | null = null;

	onMount(() => {
		const unsubscribe = beforeNavigate((nav) => {
			if (shouldBlock() && nav.to?.url) {
				nav.cancel(); // stop the navigation
				nextUrl = nav.to.url.pathname + nav.to.url.search + nav.to.url.hash;

				onBlock(() => {
					if (nextUrl) {
						goto(nextUrl);
						nextUrl = null;
					}
				});
			}
		});

		return unsubscribe;
	});
</script>
