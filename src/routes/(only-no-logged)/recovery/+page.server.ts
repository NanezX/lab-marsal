import { PasswordRecoverySchema } from '$lib/server/utils/zod';
import { superValidate, fail as failForms, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions } from './$types';
import { findUserByEmail } from '$lib/server/utils/dbQueries';

export const load = async () => {
	const recoveryForm = await superValidate(zod(PasswordRecoverySchema));

	return { recoveryForm };
};

// recovery
export const actions: Actions = {
	recovery: async (event) => {
		const request = event.request;
		const form = await superValidate(request, zod(PasswordRecoverySchema));

		if (!form.valid) {
			// Again, return { form } and things will just work.
			return failForms(400, { form });
		}

		// Obtain the email from the form
		const { email } = form.data;

		// Search the user
		const existingUser = await findUserByEmail(email.toLowerCase());
		if (!existingUser || existingUser.deleted) {
			return message(
				form,
				{ text: 'Correo electrónico no encontrado', type: 'error' },
				{ status: 401 }
			);
		}

		// 1. Invalidate/delete previous reset tokens
		// 2. Generate a new reset session token
		// 3. Send the email with the code
		// 4. Set the cookie with the name, the sessionToken and expire time
		// 5. Return success, the front will redirect with goto to the "/recovery/verify"
	}
};
