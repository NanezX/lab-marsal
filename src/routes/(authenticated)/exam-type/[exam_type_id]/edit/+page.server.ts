import { superValidate, fail as failForms, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad, Actions } from './$types';
import { cleanEditExamTypeData } from '$lib/shared/utils';
import { editExamTypeSchema } from '$lib/server/utils/zod';
import { findExamTypeById } from '$lib/server/utils/dbQueries';
import { db } from '$lib/server/db';
import { examType } from '$lib/server/db/schema';
import { isUniqueConstraintViolation } from '$lib/server/utils/helpers';

// TODO: Verify what roles can update an exam type (on the action)

export const load: PageServerLoad = async ({ parent }) => {
	// Get the data from the layout
	const data = await parent();

	// Get the examTypeData
	const { examTypeData } = data;

	// Clean/format the data for the schema
	const cleaned = cleanEditExamTypeData(examTypeData);

	// Create the form
	const editExamTypeForm = await superValidate(cleaned, zod(editExamTypeSchema));

	return { editExamTypeForm };
};

export const actions: Actions = {
	default: async (event) => {
		const request = event.request;
		const form = await superValidate(request, zod(editExamTypeSchema));

		if (!form.valid) {
			console.log('form not valid');
			console.log(JSON.stringify(form.errors, null, 2));
			// Again, return { form } and things will just work.
			return failForms(400, { form });
		}

		console.log(JSON.stringify(form.data, null, 2));

		const { id, name, basePrice, categories, description, parameters, deletedParameters } =
			form.data;

		// Check if there is a Exam Type with this ID
		const examTypeSaved = findExamTypeById(id);
		if (examTypeSaved === undefined) {
			return message(
				form,
				{ text: 'ID de tipo de exámen no encontrado', type: 'error' },
				{ status: 409 }
			);
		}

		try {
			// EXAM TYPES: ID and NAME are uniques
			// PARAMETERS: ID are uniques
			// Doing update within the same transaction to handle rollbacks too in case any failure
			await db.transaction(async (tx) => {
				//
				await tx
					.insert(examType)
					.values({
						id,
						name,
						description,
						basePrice: basePrice.toString(),
						categories
					})
					.onConflictDoUpdate({
						target: examType.id,
						set: {
							name,
							description,
							basePrice: basePrice.toString(),
							categories
						}
					});
			});

			return message(form, { text: 'Tipo de exámen editado correctamente', type: 'success' });
		} catch (e) {
			let errMsg = 'No se editó el tipo de exámen';

			if (isUniqueConstraintViolation(e, 'exam_type_name_unique')) {
				errMsg = 'Nombre de tipo de exámen en uso';
			} else if (e instanceof Error) {
				// Print the error type
				console.error('Unknown error');
			}

			// Print the error
			console.error(e);

			return message(form, { text: errMsg, type: 'error' }, { status: 500 });
		}
	}
};
