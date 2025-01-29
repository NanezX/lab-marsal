import { UserLoginSchema } from '$lib/utils/zod';
import { message, superValidate, fail as failForms } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { fail as failSvelte } from '@sveltejs/kit';

// TODO: Add the message type based on the docs: https://superforms.rocks/concepts/messages
// Basically, createa message object /type. We can add it to the globals
// TODO: Integrate toastify for the messages

export const load = async () => {
	const loginForm = await superValidate(zod(UserLoginSchema));

	return { loginForm };
};

export const actions = {
	login: async ({ request }) => {
		const form = await superValidate(request, zod(UserLoginSchema));
		console.log(form);

		console.log(form.data);

		if (!form.valid) {
			// Again, return { form } and things will just work.
			return failForms(400, { form });
		}

		// TODO: Do something REAL with the validated form.data
		// TODO: Redirect after succesful login. Use the current code from Lucia

		return mockLogin(form, form.data.email, form.data.password);
	}
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mockLogin(form: any, email: string, password: string) {
	const validUser = {
		email: 'admin@gmail.com',
		password: 'Admin123'
	};

	if (validUser.email != email.toLowerCase() || validUser.password != password) {
		return message(form, 'Credenciales incorrectos', { status: 401 });
	}

	return message(form, 'Inicio de sesión exitoso');
}
