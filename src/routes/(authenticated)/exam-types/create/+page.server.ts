import { superValidate, fail as failForms, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions } from './$types';
import { findExamTypeByName } from '$lib/server/utils/dbQueries';
import postgres from 'postgres';
import { examType, parameter as parameterTable } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { examTypeSchema } from '$lib/server/utils/zod';

// TODO: Verify what roles can create an exam type

export const load = async () => {
	const examTypeForm = await superValidate(zod(examTypeSchema));

	return { examTypeForm };
};

export const actions: Actions = {
	default: async (event) => {
		const request = event.request;
		const form = await superValidate(request, zod(examTypeSchema));

		if (!form.valid) {
			console.log('form not valid');
			console.log(JSON.stringify(form.errors, null, 2));
			// Again, return { form } and things will just work.
			return failForms(400, { form });
		}

		const { name, description, basePrice, parameters, categories } = form.data;

		// Check if there is an exam type with the same name
		const examTypeCreated = await findExamTypeByName(name);

		if (examTypeCreated) {
			// Against some rules to avoid exposing vulnerabilities, we return the 409 error for already taken emails
			// because this is intented to be an internal application on the organization
			return message(
				form,
				{ text: 'Nombre de tipo de examen ya existente', type: 'error' },
				{ status: 409 }
			);
		}

		try {
			// Doing inserts within the same transaction to handle rollbacks too in case any failure
			await db.transaction(async (tx) => {
				// Inserting the exam type to the database
				const insertExamTypeResponse = await tx
					.insert(examType)
					.values({
						name,
						description,
						basePrice: basePrice.toString(),
						categories
					})
					.returning({ insertedId: examType.id });

				// Get and check the inserted ID
				const insertedId = insertExamTypeResponse[0]?.insertedId;
				if (!insertedId) {
					throw new Error('El tipo de exámen no fue insertado en la tabla');
				}

				// Insert parameters rows with the exam type relationship
				await tx.insert(parameterTable).values(
					parameters.map((param_) => ({
						...param_,
						examTypeId: insertedId
					}))
				);
			});

			return message(form, { text: 'Tipo de exámen creado correctamente', type: 'success' });
		} catch (e) {
			// Default message
			let errMsg = 'No se guardó el tipo de exámen';

			// Print the error type
			if (e instanceof postgres.PostgresError) {
				console.error('PostgresError');
				errMsg = errMsg + ' - PG';
			} else if (e instanceof Error) {
				console.error('Unknown error');
			}

			// Print the error
			console.error(e);

			return message(form, { text: errMsg, type: 'error' }, { status: 500 });
		}
	}
};
