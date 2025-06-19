import { findExamById } from '$lib/server/utils/dbQueries';
import { editExamResultsSchema } from '$lib/server/utils/zod';
import { cleanEditExamResults } from '$lib/shared/utils';
import { superValidate, fail as failForms } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { failFormResponse } from '$lib/server/utils/failFormResponse';
import type { Actions, PageServerLoad } from './$types';

// TODO: Verify what roles can update an exam (on the action) - (maybe just block the page to those user in the backend)

export const load: PageServerLoad = async ({ parent }) => {
	// Get the data from the layout
	const data = await parent();

	// Get the examData
	const { examData } = data;

	// Clean/format the data for the schema
	const cleanedData = cleanEditExamResults(examData);

	// Create the form for editing
	const editExamResults = await superValidate(cleanedData, zod(editExamResultsSchema));

	return { editExamResults };
};

export const actions: Actions = {
	default: async (event) => {
		const request = event.request;
		const form = await superValidate(request, zod(editExamResultsSchema));

		if (!form.valid) {
			console.error(JSON.stringify(form.errors, null, 2));
			// Again, return { form } and things will just work.
			return failForms(400, { form });
		}

		const { examId, sample, observation, results } = form.data;

		// Check if exam exists
		const examExist = await findExamById(examId);
		if (examExist === undefined) {
			return failFormResponse(form, 'ID del exámen no encontrado', event.cookies, 409);
		}
	}
};
