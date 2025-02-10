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
		<Text class="text-lg">Hemos recibido una solicitud para reestablecer tu contraseña.</Text>
		<Text class="mt-4 w-fit text-lg">Tu código de recuperación es:</Text>

		<Text class="text-center font-mono text-3xl font-bold">{code}</Text>

		<Text class="mt-12 w-fit">Si no fuiste tú, ignora este correo.</Text>

		<Preview preview="Código de recuperación de cuenta" />
	</Container>
</Html>
