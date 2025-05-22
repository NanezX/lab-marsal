import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createPatientSchema } from '$lib/server/utils/zod';

// TODO: Verify what roles can create an exam type (on the action) - (maybe just block the page to those user in the backend)

export const load = async () => {
	const createPatientForm = await superValidate(zod(createPatientSchema));

	return { createPatientForm };
};
