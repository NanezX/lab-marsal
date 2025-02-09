<script>
	import { Button, Hr, Html, Text, Head, Container } from 'svelte-email-tailwind';

	let { name } = $props();
</script>

<!-- <Html lang="en"> -->
<Container class="w-full">
	<Head />
	<Text class="text-[24px] md:text-[18px]">Hello world!</Text>
	<Hr />
	<Text class="text-red-400">Always have faith: {name}</Text>
</Container>
<!-- </Html> -->
