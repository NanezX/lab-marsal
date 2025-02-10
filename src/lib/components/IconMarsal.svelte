<script lang="ts">
	import icon from '$lib/assets/icon.png';

	type Props = {
		width?: number;
		height?: number;
	};

	let { width = 100, height = 100 }: Props = $props();
</script>

<img alt="El logo de MarsalLab" src={icon} {width} {height} />
