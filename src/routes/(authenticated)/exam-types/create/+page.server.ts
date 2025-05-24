import { superValidate, fail as failForms } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions } from './$types';
import {
	findExamTypeByName,
	getAllExamTypeClassifications,
	getOrCreateClassification
} from '$lib/server/utils/dbQueries';
import postgres from 'postgres';
import { examType, parameter as parameterTable } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { examTypeSchema } from '$lib/server/utils/zod';
import { AppDataNotSavedError } from '$lib/server/error';
import { failFormResponse } from '$lib/server/utils/failFormResponse';
import { redirect } from 'sveltekit-flash-message/server';
import { normalized } from '$lib/shared/utils';

// TODO: Verify what roles can create an exam type (on the action) - (maybe just block the page to those user in the backend)

export const load = async () => {
	const examTypeForm = await superValidate(zod(examTypeSchema));

	const classifications = await getAllExamTypeClassifications();

	return { examTypeForm, classifications };
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

		const { name, description, basePrice, parameters, classification, categories } = form.data;

		// Check if there is an exam type with the same name
		const examTypeCreated = await findExamTypeByName(name);

		if (examTypeCreated && examTypeCreated.deleted === false) {
			// Against some rules to avoid exposing vulnerabilities, we return the 409 error for already taken emails
			// because this is intented to be an internal application on the organization
			return failFormResponse(form, 'Nombre de tipo de examen ya existente', event.cookies, 409);
		}

		try {
			// Doing inserts within the same transaction to handle rollbacks too in case any failure
			await db.transaction(async (tx) => {
				// Find or create the classification name
				const classificationId = await getOrCreateClassification(classification, tx);

				// Construct the exam type data
				const examTypeData = {
					name,
					nameNormalized: normalized(name),
					description,
					basePrice: basePrice.toString(),
					categories,
					classificationId
				};

				// Inserting the exam type to the database
				const insertExamTypeResponse = await tx
					.insert(examType)
					.values(examTypeData)
					.onConflictDoUpdate({
						target: examType.nameNormalized,
						set: {
							...examTypeData,
							deleted: false
						}
					})
					.returning({ insertedId: examType.id });

				// Get and check the inserted ID
				const insertedId = insertExamTypeResponse[0]?.insertedId;
				if (!insertedId) {
					throw new AppDataNotSavedError('No se guardó el tipo de exámen');
				}

				// Insert parameters rows with the exam type relationship
				await tx.insert(parameterTable).values(
					parameters.map((param_) => ({
						...param_,
						examTypeId: insertedId
					}))
				);
			});
		} catch (e) {
			// Default message
			let errMsg = 'No se guardó el tipo de exámen';

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

			return failFormResponse(form, errMsg, event.cookies, 500);
		}

		redirect(
			`/exam-types`,
			{ type: 'success', message: 'Tipo de exámen creado correctamente' },
			event.cookies
		);
	}
};
