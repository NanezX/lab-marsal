import { editPatientSchema } from '$lib/server/utils/zod';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { cleanEditPatientData } from '$lib/shared/utils';
import type { PageServerLoad } from './$types';

// TODO: Support edit. Like firstName, lastName, documentId, birthdate, gender, email phoneNumber

export const load: PageServerLoad = async ({ parent }) => {
	// Get the data from the layout
	const data = await parent();

	// Get the examTypeData
	const { patientData } = data;

	// Clean/format the data for the schema
	const cleaned = cleanEditPatientData(patientData);

	// Create the form for deleting (if desired)
	const editPatientForm = await superValidate(cleaned, zod(editPatientSchema));

	return { editPatientForm };
};
