<script lang="ts">
	import { Button, Hr, Html, Text, Head, Container, Section, Column } from 'svelte-email-tailwind';

	type PropType = {
		firstName: string;
		lastName: string;
		role: string;
		documentId: number;
		email: string;
		birthdate: string;
	};

	let { firstName, lastName, role, documentId, email, birthdate }: PropType = $props();
</script>

<Html lang="en">
	<Head />
	<Text class="text-center text-3xl">¡Bienvenido a LabMarsal! 🔬💙</Text>
	<Hr />
	<Container>
		<Text class="text-xl">¡Hola {firstName}!</Text>
		<Text class="text-xl">Tu usuario en LabMarsal ha sido creado exitosamente 🎉</Text>

		<Text class="mt-10 w-fit text-lg">Tus datos han sido guardados:</Text>

		<Text class="text-lg"><strong>- Nombre y apellido:</strong> {firstName} {lastName}</Text>
		<Text class="text-lg"><strong>- Cédula de Identidad:</strong> {documentId}</Text>
		<Text class="text-lg"><strong>- Email:</strong> {email}</Text>
		<Text class="text-lg"><strong>- Rol:</strong> {role}</Text>
		<Text class="text-lg"><strong>- Cumpleaños:</strong> {birthdate}</Text>
	</Container>
</Html>
