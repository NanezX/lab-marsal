import { superValidate, fail as failForms } from 'sveltekit-superforms';
import { editPatientSchema } from '$lib/server/utils/zod';
import { zod } from 'sveltekit-superforms/adapters';
import { cleanEditPatientData, normalized } from '$lib/shared/utils';
import type { Actions, PageServerLoad } from './$types';
import { findPatientById } from '$lib/server/utils/dbQueries';
import { db } from '$lib/server/db';
import { patient as patientTable } from '$lib/server/db/schema';
import { isUniqueConstraintViolation } from '$lib/server/utils/helpers';
import { failFormResponse } from '$lib/server/utils/failFormResponse';
import { redirect } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async ({ parent }) => {
	// Get the data from the layout
	const data = await parent();

	// Get the examData
	const { examData } = data;

	// // Clean/format the data for the schema
	// const cleaned = cleanEditPatientData(patientData);

	// // Create the form for deleting (if desired)
	// const editPatientForm = await superValidate(cleaned, zod(editPatientSchema));

	return {};
};
