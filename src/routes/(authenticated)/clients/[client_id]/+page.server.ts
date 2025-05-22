import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { deletePatientSchema } from '$lib/server/utils/zod';
import type { PageServerLoad } from './$types';

// TODO: Verify what roles can delete an patient (on the action) - (maybe just block the page to those user in the backend)

export const load: PageServerLoad = async ({ params }) => {
	// Create the form
	const deletePatientForm = await superValidate(
		{ patientId: params.client_id },
		zod(deletePatientSchema)
	);

	return { deletePatientForm };
};
