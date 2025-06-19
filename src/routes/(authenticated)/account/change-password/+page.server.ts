import { superValidate, fail as failForms } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { ChangePasswordSchema } from '$lib/server/utils/zod';
import type { Actions } from './$types';
import { fail as failSvelte } from '@sveltejs/kit';
import { findUserByEmail } from '$lib/server/utils/dbQueries';
import { failFormResponse } from '$lib/server/utils/failFormResponse';
import { verify, hash } from '@node-rs/argon2';
import { hashingOptions } from '$lib/server/auth';
import { updateUserById } from '$lib/server/utils/dbUpdates';
import { redirect } from 'sveltekit-flash-message/server';

export const load = async () => {
	const changePasswordForm = await superValidate(zod(ChangePasswordSchema));

	return { changePasswordForm };
};

export const actions: Actions = {
	default: async (event) => {
		// The user must be authenticated to access this page
		// He will be changing his own password only
		if (!event.locals.user) {
			return failSvelte(401, { message: 'Unauthorized' });
		}

		const request = event.request;
		const form = await superValidate(request, zod(ChangePasswordSchema));

		if (!form.valid) {
			console.error(JSON.stringify(form.errors, null, 2));
			// Again, return { form } and things will just work.
			return failForms(400, { form });
		}

		// No need for getting the user from the database, as we already have it in event.locals.user
		// Also, no need to use `repeatNewPassword` since zod will ensure that `newPassword` and `repeatNewPassword` match
		const { oldPassword, newPassword } = form.data;

		// We check that the current user exists and is not deleted. Generally this should not happen,
		// but it's a good practice to ensure the user is valid
		const currentUserData = await findUserByEmail(event.locals.user.email.toLowerCase());
		if (!currentUserData || currentUserData.deleted) {
			return failFormResponse(form, 'Usuario inválido', event.cookies, 401);
		}

		// Verify password entered
		const validPassword = await verify(
			currentUserData.passwordHash,
			oldPassword,
			hashingOptions
		);
		if (!validPassword) {
			return failFormResponse(form, 'Contraseña actual inválida', event.cookies, 401);
		}

		// Hash the introduced new password
		const newPasswordHash = await hash(newPassword, hashingOptions);

		// Update/change the password
		await updateUserById(event.locals.user.id, { passwordHash: newPasswordHash });

		redirect(
			'/account',
			{ type: 'success', message: 'Contraseña cambiada correctamente' },
			event.cookies
		);
	}
};
