import { superValidate, fail as _failForms } from 'sveltekit-superforms';
import { editExamDetailsSchema } from '$lib/server/utils/zod';
import { zod } from 'sveltekit-superforms/adapters';
// import { cleanEditPatientData, normalized } from '$lib/shared/utils';
import type { Actions as _, PageServerLoad } from './$types';
// import { findPatientById } from '$lib/server/utils/dbQueries';
// import { db } from '$lib/server/db';
// import { patient as patientTable } from '$lib/server/db/schema';
// import { isUniqueConstraintViolation } from '$lib/server/utils/helpers';
// import { failFormResponse } from '$lib/server/utils/failFormResponse';
// import { redirect } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async ({ parent }) => {
	// Get the data from the layout
	const data = await parent();

	// Get the examData
	const { examData } = data;

	// const cleaned = cleanEditPatientData(patientData);
	// Clean/format the data for the schema
	const cleanedData = {
		examId: examData.id,
		customTag: examData.customTag,
		priority: examData.priority,
		status: examData.status
	};

	// Create the form for editing
	const editExamDetailsForm = await superValidate(cleanedData, zod(editExamDetailsSchema));

	return { editExamDetailsForm };
};
