import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions } from './$types';

////
import { z } from 'zod';
import type { ExamParemeterInput } from './params';

const initParameter: ExamParemeterInput = {
	name: '',
	type: 'text', // | "number";
	category: undefined,
	unit: '',
	hasReferences: false,
	referenceValues: []
};

const examParameterSchema = z.object({
	// Positon of the parameter in the form
	position: z.number().min(0),
	// Parameter data
	parameter: z.object({
		name: z.string().min(1),
		// type: z.union([z.literal("text"), z.literal('number')])
		type: z.literal("text"),
		category: z.string().min(1).optional(),
		unit: z.string().min(1),
		hasReferences: z.boolean(),
		referenceValues: z.array(z.string())

	})
})

const examTypeSchema = z.object({
	name: z.string().min(1),
	description: z.string().optional(),
	basePrice: z.number().positive(),
	clasification: z.string().optional(), // Not sure about this
	parameters: z.array(examParameterSchema).min(1).default([{ position: 0, parameter: initParameter }]),
	categories: z.array(z.string())
});

export type ExamTypeSchema = typeof examTypeSchema;
/////

export const load = async () => {
	const examTypeForm = await superValidate(zod(examTypeSchema));

	return { examTypeForm };
};

export const actions: Actions = {
	default: async (event) => {
		const request = event.request;
		const form = await superValidate(request, zod(examTypeSchema));

		console.log('form: ', form);
		console.log('------')
		console.log('form json: ', JSON.stringify(form.data, null, 2));
		console.log('------')
		console.log('form error: ', JSON.stringify(form.errors, null, 2));
		console.log('------ ', Date.now())

	}
};
