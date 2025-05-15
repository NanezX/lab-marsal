import { superValidate } from 'sveltekit-superforms';
import { z } from 'zod';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import type { ExamTypeWithParameters } from '$lib/shared/types';

const examParameterSchema = z.object({
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

const examTypeSchema = z
	.object({
		name: z.string().min(1, 'El nombre es obligatorio'),
		description: z.string().optional().nullable(),
		basePrice: z.number().positive('El precio base debe ser mayor a 0 USD'),
		clasification: z.string().optional(), // Not sure about this
		categories: z.array(z.string()),
		parameters: z
			.array(examParameterSchema)
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

export const load: PageServerLoad = async ({ parent }) => {
	const data = await parent();

	const { examTypeData } = data;

	function cleanExamTypeData(data: ExamTypeWithParameters) {
		return {
			name: data.name,
			description: data.description ?? undefined,
			basePrice: parseFloat(data.basePrice),
			categories: data.categories,
			clasification: undefined, // or map from your DB if available
			parameters: data.parameters.map((p) => ({
				position: p.position,
				name: p.name,
				type: 'text' as const,
				category: p.category ?? undefined,
				unit: p.unit,
				hasReferences: p.hasReferences,
				referenceValues: p.referenceValues
			}))
		};
	}

	const cleaned = cleanExamTypeData(examTypeData);

	const examTypeForm = await superValidate(cleaned, zod(examTypeSchema));

	return { examTypeForm };
};
