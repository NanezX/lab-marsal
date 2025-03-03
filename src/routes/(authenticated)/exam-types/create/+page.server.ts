import { superValidate, fail as failForms, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { Actions } from './$types';
import { findExamTypeByName } from '$lib/server/utils/dbQueries';
import postgres from 'postgres';
import { examType } from '$lib/server/db/schema';
import { db } from '$lib/server/db';

const examParameterSchema = z.object({
	// Positon of the parameter in the form
	position: z.number().min(0),
	// Parameter data
	parameter: z.object({
		name: z.string().min(1, 'El parámetro debe tener un nombre'),
		type: z.literal('text'),
		category: z.string().min(1).optional(),
		unit: z.string().min(1, 'Debe especificar la unidad del parámetro'),
		hasReferences: z.boolean(),
		referenceValues: z.array(z.string().min(1, 'Debe ingresar el valor de referencia'))
	})
});

const examTypeSchema = z
	.object({
		name: z.string().min(1, 'El nombre es obligatorio'),
		description: z.string().optional(),
		basePrice: z.number().positive('El precio base debe ser mayor a 0 USD'),
		clasification: z.string().optional(), // Not sure about this
		categories: z.array(z.string()),
		parameters: z
			.array(examParameterSchema)
			.min(1)
			.default([
				{
					position: 0,
					parameter: {
						name: '',
						type: 'text', // | "number";
						category: undefined,
						unit: '',
						hasReferences: false,
						referenceValues: []
					}
				}
			])
	})
	.superRefine((obj, ctx) => {
		// Check each parameter
		obj.parameters.forEach((param, index) => {
			// If the parameter has a category, it must exist in the categories array
			if (param.parameter.category && !obj.categories.includes(param.parameter.category)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `La categoría "${param.parameter.category}" no existe en la lista de categorías`,
					path: ['parameters', index, 'parameter', 'category']
				});
			}
		});
	});

export type ExamTypeSchema = typeof examTypeSchema;

export const load = async () => {
	const examTypeForm = await superValidate(zod(examTypeSchema));

	return { examTypeForm };
};

export const actions: Actions = {
	default: async (event) => {
		const request = event.request;
		const form = await superValidate(request, zod(examTypeSchema));

		if (!form.valid) {
			console.log('form not valid');
			// Again, return { form } and things will just work.
			return failForms(400, { form });
		}

		const { name, description, basePrice, parameters, categories } = form.data;

		// Check if there is an exam type with the same name
		const examTypeCreated = await findExamTypeByName(name);

		if (examTypeCreated) {
			// Against some rules to avoid exposing vulnerabilities, we return the 409 error for already taken emails
			// because this is intented to be an internal application on the organization
			return message(
				form,
				{ text: 'Ya existe un tipo de examen con este nombre', type: 'error' },
				{ status: 409 }
			);
		}

		try {
			// Inserting the exam type to the database
			const insertResponse = await db
				.insert(examType)
				.values({
					name,
					description,
					basePrice: basePrice.toString(),
					parameters,
					categories
				})
				.returning({ newId: examType.id });

			const newId = insertResponse[0]?.newId;
			if (!newId) {
				throw new Error('No se guardo el tipo de exámen');
			}

			return message(form, { text: 'Tipo de exámen creado correctamente', type: 'success' });
		} catch (e) {
			// Default message
			let errMsg = 'Ha ocurrido un error';

			if (e instanceof postgres.PostgresError) {
				console.error('PostgresError');
				errMsg = errMsg + ' - PG';
			} else if (e instanceof Error) {
				console.error('Unknown error');
				console.error(e);
			}

			return message(form, { text: errMsg, type: 'error' }, { status: 500 });
		}
	}
};
