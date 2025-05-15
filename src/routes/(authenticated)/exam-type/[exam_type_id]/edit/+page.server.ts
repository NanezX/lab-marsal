import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import { validate } from 'uuid';
import { cleanExamTypeData } from '$lib/shared/utils';

// TODO: Verify what roles can update an exam type (on the action)

// Schema for an Exam type parameter
const examTypeParameterSchema = z.object({
	// Positon of the parameter in the form
	// Parameter data
	position: z.number().min(0),
	name: z.string().min(1, 'El parámetro debe tener un nombre'),
	type: z.literal('text'),
	category: z.string().min(1).optional(),
	unit: z.string().min(1, 'Debe especificar la unidad del parámetro'),
	hasReferences: z.boolean(),
	referenceValues: z.array(z.string().min(1, 'Debe ingresar el valor de referencia'))
});

// Schema for an Exam type
const examTypeSchema = z
	.object({
		name: z.string().min(1, 'El nombre es obligatorio'),
		description: z.string().optional().nullable(),
		basePrice: z.number().positive('El precio base debe ser mayor a 0 USD'),
		categories: z.array(z.string()),
		parameters: z
			.array(examTypeParameterSchema)
			.min(1)
			.default([
				{
					position: 0,
					name: '',
					type: 'text', // | "number";
					category: undefined,
					unit: '',
					hasReferences: false,
					referenceValues: []
				}
			])
	})
	.superRefine((obj, ctx) => {
		// Check each parameter
		obj.parameters.forEach((param, index) => {
			// If the parameter has a category, it must exist in the categories array
			if (param.category && !obj.categories.includes(param.category)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `La categoría "${param.category}" no existe en la lista de categorías`,
					path: ['parameters', index, 'parameter', 'category']
				});
			}
		});
	});

const _editExamTypeSchema = z.object({
	id: z.string().refine((value_) => {
		return validate(value_);
	}, 'ID del tipo de exámen no válido'),
	name: z.string().min(1, 'El nombre es obligatorio'),
	description: z.string().optional().nullable(),
	basePrice: z.number().positive('El precio base debe ser mayor a 0 USD'),
	categories: z.array(z.string())
});

export type ExamTypeSchema = typeof examTypeSchema;

//////////

export const load: PageServerLoad = async ({ parent }) => {
	const data = await parent();

	const { examTypeData } = data;

	const cleaned = cleanExamTypeData(examTypeData);

	const examTypeForm = await superValidate(cleaned, zod(examTypeSchema));

	return { examTypeForm };
};
