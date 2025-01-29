<script lang="ts">
	const props = $props();

	const children = props.children;
</script>

<div class={['mx-auto shadow-2xl', props.class]}>
	{@render children()}
</div>
