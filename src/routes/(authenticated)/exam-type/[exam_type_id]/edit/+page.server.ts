import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import { validate } from 'uuid';
import { cleanEditExamTypeData } from '$lib/shared/utils';
import { examTypeParameterSchema, examTypeSchema } from '$lib/server/utils/zod';

// TODO: Verify what roles can update an exam type (on the action)

const editExamTypeParameterSchema = examTypeParameterSchema.extend({
	id: z.string().refine((value_) => {
		return validate(value_);
	}, 'ID del tipo de exámen no válido').optional()
});

const editExamTypeSchema = examTypeSchema.innerType().extend({
	id: z.string().refine((value_) => {
		return validate(value_);
	}, 'ID del tipo de exámen no válido'),
	parameters: z.array(editExamTypeParameterSchema).min(1)
});

export const load: PageServerLoad = async ({ parent }) => {
	// Get the data from the layout
	const data = await parent();

	// Get the examTypeData
	const { examTypeData } = data;

	// Clean/format the data for the schema
	const cleaned = cleanEditExamTypeData(examTypeData);

	// Create the form
	const editExamTypeForm = await superValidate(cleaned, zod(editExamTypeSchema));

	return {  editExamTypeForm };
};
