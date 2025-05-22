import { superValidate, fail as failForms, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createPatientSchema } from '$lib/server/utils/zod';
import type { Actions } from './$types';
import { findPatientByDocumentId } from '$lib/server/utils/dbQueries';
import { db } from '$lib/server/db';
import { patient as patientTable } from '$lib/server/db/schema';
import { normalized } from '$lib/shared/utils';
import { AppDataNotSavedError } from '$lib/server/error';
import postgres from 'postgres';

// TODO: Verify what roles can create an exam type (on the action) - (maybe just block the page to those user in the backend)

export const load = async () => {
	const createPatientForm = await superValidate(zod(createPatientSchema));

	return { createPatientForm };
};

export const actions: Actions = {
	default: async (event) => {
		const request = event.request;
		const form = await superValidate(request, zod(createPatientSchema));

		if (!form.valid) {
			console.log('form not valid');
			console.log(JSON.stringify(form.errors, null, 2));
			// Again, return { form } and things will just work.
			return failForms(400, { form });
		}

		console.log('form.data: ', JSON.stringify(form.data, null, 2));
		const { firstName, lastName, documentId, birthdate, gender, email, phoneNumber } = form.data;

		// Check if there is a patient with this document ID
		const patientCreated = await findPatientByDocumentId(documentId);

		if (patientCreated) {
			// Against some rules to avoid exposing vulnerabilities, we return the 409 error for already taken emails
			// because this is intented to be an internal application on the organization
			return message(
				form,
				{ text: 'Cédula de identidad ya registrada', type: 'error' },
				{ status: 409 }
			);
		}
		try {
			const insertedPatient = await db
				.insert(patientTable)
				.values({
					firstName,
					lastName,
					firstNameNormalized: normalized(firstName),
					lastNameNormalized: normalized(lastName),
					documentId,
					birthdate: new Date(birthdate),
					gender,
					// These two are optional
					email,
					phoneNumber
				})
				.returning({ insertedId: patientTable.id });

			// Get and check the inserted ID
			const insertedId = insertedPatient[0]?.insertedId;
			if (!insertedId) {
				throw new AppDataNotSavedError('No se añadió el paciente');
			}

			return message(form, { text: 'Paciente añadido correctamente', type: 'success' });
		} catch (e) {
			// Default message
			let errMsg = 'No se añadió el paciente';

			// Print the error type
			if (e instanceof postgres.PostgresError) {
				console.error('PostgresError');
				errMsg = errMsg + ' - PG';
			} else if (e instanceof AppDataNotSavedError) {
				errMsg = e.message;
			} else if (e instanceof Error) {
				console.error('Unknown error');
			}

			// Print the error
			console.error(e);

			return message(form, { text: errMsg, type: 'error' }, { status: 500 });
		}
	}
};
