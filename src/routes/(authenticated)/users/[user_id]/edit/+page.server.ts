import { superValidate, fail as failForms } from 'sveltekit-superforms';
import { UserEditSchema } from '$lib/server/utils/zod';
import { zod } from 'sveltekit-superforms/adapters';
import { cleanEditPatientData, cleanEditUserData, normalized } from '$lib/shared/utils';
import { validate } from 'uuid';
import type { Actions, PageServerLoad } from './$types';
import { findPatientById } from '$lib/server/utils/dbQueries';
import { db } from '$lib/server/db';
import { patient as patientTable } from '$lib/server/db/schema';
import { isUniqueConstraintViolation } from '$lib/server/utils/helpers';
import { failFormResponse } from '$lib/server/utils/failFormResponse';
import { redirect } from 'sveltekit-flash-message/server';
import { error as svelteError } from '@sveltejs/kit';

// TODO: Verify what roles can update an patient (on the action) - (maybe just block the page to those user in the backend)

export const load: PageServerLoad = async ({ params }) => {
	if (!validate(params.user_id)) {
		svelteError(404, 'ID de usuario no válido');
	}

	const foundUser = await db.query.user.findFirst({
		where: (u, { and, eq }) => and(eq(u.id, params.user_id), eq(u.deleted, false)),
		columns: {
			id: true,
			role: true,
			firstName: true,
			lastName: true,
			documentId: true,
			email: true,
			deleted: true
		}
	});

	if (!foundUser || foundUser.deleted) {
		svelteError(404, 'Usuario no encontrado');
	}

	// Clean/format the data for the schema
	const cleaned = cleanEditUserData(foundUser);

	// Create the form for deleting (if desired)
	const editUserForm = await superValidate(cleaned, zod(UserEditSchema));

	const { deleted: _deleted, ...userData } = foundUser;

	return { editUserForm, userData };
};

export const actions: Actions = {
	default: async (event) => {
		console.log('event.params: ', event.params);
	}
};
