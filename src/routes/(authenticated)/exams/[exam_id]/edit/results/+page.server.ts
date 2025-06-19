import { editExamResultsSchema } from '$lib/server/utils/zod';
import { cleanEditExamResults } from '$lib/shared/utils';
import type { Actions, PageServerLoad } from './$types';
import { superValidate, fail as failForms } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

// TODO: Verify what roles can update an exam (on the action) - (maybe just block the page to those user in the backend)

export const load: PageServerLoad = async ({ parent }) => {
	// Get the data from the layout
	const data = await parent();

	// Get the examData
	const { examData } = data;

	// Clean/format the data for the schema
	const cleanedData = cleanEditExamResults(examData);

	// Create the form for editing
	const editExamDetailsForm = await superValidate(cleanedData, zod(editExamResultsSchema));

	return { editExamDetailsForm };
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

		// CONTINUE HERE
	}
};
