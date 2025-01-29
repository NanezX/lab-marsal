<script lang="ts">
	const props = $props();

	const children = props.children;
</script>

<div class={['mx-auto h-fit w-fit shadow-2xl', props.class]}>
	{@render children()}
</div>
