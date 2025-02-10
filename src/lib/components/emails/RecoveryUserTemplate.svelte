<script lang="ts">
	import { Hr, Html, Text, Head, Container, Preview } from 'svelte-email-tailwind';

	type PropType = {
		code: string;
	};

	let { code }: PropType = $props();
</script>

<Html lang="en">
	<Head />
	<Text class="text-center text-3xl">Recuperación de constraseña</Text>
	<Hr />
	<Container>
		<Text class="text-xl">¡Hola!</Text>
		<Text class="text-xl">Hemos recibido una solicitud para reestablecer tu contraseña</Text>

		<Text class="mt-10 w-fit text-lg">Tu código de recuperación es:</Text>

		<Text class="text-center text-xl font-bold">{code}</Text>

		<Preview preview="El código es {code}" />
	</Container>
</Html>
