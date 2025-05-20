import { superValidate, fail as failForms, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad, Actions } from './$types';
import { cleanEditExamTypeData } from '$lib/shared/utils';
import { editExamTypeSchema } from '$lib/server/utils/zod';
import { findExamTypeById } from '$lib/server/utils/dbQueries';
import { db } from '$lib/server/db';
import { examType, parameter as parameterTable } from '$lib/server/db/schema';
import { isUniqueConstraintViolation } from '$lib/server/utils/helpers';
import { inArray, sql } from 'drizzle-orm';

// TODO: Verify what roles can update an exam type (on the action) - (maybe just block the page to those user in the backend)

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
			// PARAMETERS: ID are uniques
			// Doing update within the same transaction to handle rollbacks too in case any failure
			await db.transaction(async (tx) => {
				// Upsert the exam type
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

				// Upsert modified exam type params
				await tx
					.insert(parameterTable)
					.values(
						parameters.map((param_) => ({
							...param_,
							examTypeId: id
						}))
					)
					.onConflictDoUpdate({
						target: parameterTable.id,
						set: {
							name: sql.raw(`excluded.${parameterTable.name.name}`),
							type: sql.raw(`excluded.${parameterTable.type.name}`),
							position: sql.raw(`excluded.${parameterTable.position.name}`),
							unit: sql.raw(`excluded.${parameterTable.unit.name}`),
							hasReferences: sql.raw(`excluded.${parameterTable.hasReferences.name}`),
							referenceValues: sql.raw(`excluded.${parameterTable.referenceValues.name}`),
							category: sql.raw(`excluded.${parameterTable.category.name}`)
						}
					});

				// Delete the Deleted exam type params
				await tx
					.update(parameterTable)
					.set({ deleted: true })
					.where(inArray(parameterTable.id, deletedParameters));
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
