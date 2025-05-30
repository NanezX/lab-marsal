import { createExamSchema } from '$lib/server/utils/zod';
import { superValidate, fail as failForms } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions } from './$types';
import { setFlash } from 'sveltekit-flash-message/server';
import { db } from '$lib/server/db';
import { AppDataNotSavedError } from '$lib/server/error';
import postgres from 'postgres';
import { failFormResponse } from '$lib/server/utils/failFormResponse';
import { findExamTypeById, generateNextExamTag } from '$lib/server/utils/dbQueries';
// import { eq } from 'lodash-es';
// import { and } from 'drizzle-orm';
// import { examType } from '$lib/server/db/schema';

export const load = async () => {
	const createExamForm = await superValidate(zod(createExamSchema));

	return { createExamForm };
};

export const actions: Actions = {
	default: async (event) => {
		const request = event.request;
		const form = await superValidate(request, zod(createExamSchema));

		console.log('form.data: ', form.data);

		if (!form.valid) {
			console.error(JSON.stringify(form.errors, null, 2));
			// Again, return { form } and things will just work.
			return failForms(400, { form });
		}

		// const { patient, examTypeId, customTag, priority } = form.data;
		const { examTypeId, customTag } = form.data;

		try {
			await db.transaction(async (tx) => {
				// Check for existing exam type
				const existExamType = await findExamTypeById(examTypeId);
				if (!existExamType) {
					// Exam type not found
					throw new AppDataNotSavedError('No se encontró el tipo de exámen');
				}

				// TODO: Allow custom configuration for auto tag generation based on app settings
				const tag = await generateNextExamTag(tx);

				console.log('paver tag: ', tag);

				throw new AppDataNotSavedError('pa probar brotha');
			});
		} catch (e) {
			let errMsg = 'No se añadió el exámen';

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

		// Check over the patients

		// const data =  {
		//     firstName: string;
		//     lastName: string;
		//     documentId: number;
		//     birthdate: string;
		//     gender: PatientGender;
		//     email?: string | undefined;
		//     phoneNumber?: string | undefined;
		// }

		setFlash({ type: 'success', message: 'Testing this shit' }, event.cookies);
	}
};
