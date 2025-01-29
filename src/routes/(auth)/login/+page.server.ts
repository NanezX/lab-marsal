import { UserLoginSchema } from '$lib/utils/zod';
import {
	message,
	superValidate,
	fail as failForms,
	type SuperValidated
} from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

// import { fail as failSvelte } from '@sveltejs/kit';

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

// TODO: This mock function and type is temporal
type TempFormType = SuperValidated<
	{
		email: string;
		password: string;
	},
	App.Superforms.Message,
	{
		email: string;
		password: string;
	}
>;
function mockLogin(form: TempFormType, email: string, password: string) {
	const validUser = {
		email: 'admin@gmail.com',
		password: 'Admin123'
	};

	if (validUser.email != email.toLowerCase() || validUser.password != password) {
		return message(form, { text: 'Credenciales incorrectos', type: 'error' }, { status: 401 });
	}

	return message(form, { text: 'Inicio de sesión exitoso', type: 'success' });
}
