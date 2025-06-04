import {
	ExamPriority,
	ExamStatus,
	PatientGender,
	PaymentMethod,
	UserRoles
} from '$lib/shared/enums';
import { minDocumentId, maxDocumentId } from '$lib/shared/utils';
import { validate } from 'uuid';
import { parsePhoneNumberFromString } from 'libphonenumber-js/min';
import { z } from 'zod';

function birthdateRefine(value_: string): boolean {
	// Get the current date
	const minAgeDate = new Date();
	//  Set full date minus 18 years
	minAgeDate.setFullYear(minAgeDate.getFullYear() - 18);
	// Get a new date instance using the passed date
	const inputDate = new Date(value_);
	return inputDate <= minAgeDate;
}

function uuidRefine(value_: string): boolean {
	return validate(value_);
}

export const UserLoginSchema = z.object({
	email: z.string().min(1, 'Correo electrónico obligatorio').email('Correo electrónico inválido'),
	password: z
		.string()
		.min(8, 'La contraseña debe tener al menos 8 caracteres')
		.max(20, 'La contraseña debe tener máximo 20 caracteres')
});

export const UserRegisterSchema = UserLoginSchema.extend({
	repeatPassword: z.string().min(1, 'Debe repetir la contraseña'),
	firstName: z.string().min(1, 'Nombre es obligatario'),
	lastName: z.string().min(1, 'Apellido es obligatario'),
	role: z.nativeEnum(UserRoles, { errorMap: () => ({ message: 'Rol no valido' }) }),
	documentId: z
		.number()
		.min(minDocumentId, 'Solo números positivos pueden ser cédula')
		.max(maxDocumentId, 'Número muy grande para ser una cédula')
		.default('' as unknown as number),
	birthdate: z
		.string()
		.min(1, 'Debe ingresar una fecha')
		.date('No es una fecha valida')
		.refine(birthdateRefine, 'Debe tener mínimo 18 años')
}).refine((obj) => obj.password === obj.repeatPassword, {
	message: 'Las contraseñas no coinciden',
	path: ['repeatPassword']
});

export const PasswordRecoverySchema = z.object({
	email: z.string().min(1, 'Correo electrónico obligatorio').email('Correo electrónico inválido')
});

export const VerifyRecoverySchema = z
	.object({
		password: z
			.string()
			.min(8, 'La contraseña debe tener al menos 8 caracteres')
			.max(20, 'La contraseña debe tener máximo 20 caracteres'),
		repeatPassword: z.string().min(1, 'Debe repetir la contraseña'),
		code: z
			.string()
			.min(1, 'Debe ingresar el código que recibió en el correo')
			.max(5, 'Revise el código ingresado')
	})
	.refine((obj) => obj.password === obj.repeatPassword, {
		message: 'Las contraseñas no coinciden',
		path: ['repeatPassword']
	});

// Schema for an Exam type parameter
export const examTypeParameterSchema = z.object({
	// Positon of the parameter in the form
	// Parameter data
	position: z.number().min(0),
	name: z.string().min(1, 'El parámetro debe tener un nombre'),
	type: z.literal('text'),
	category: z.string().min(1).optional(),
	unit: z.string().min(1, 'Debe ingresar un texto válido como unidad').optional(),
	hasReferences: z.boolean(),
	referenceValues: z.array(z.string().min(1, 'Debe ingresar el valor de referencia'))
});

// Schema for an Exam type
export const examTypeSchema = z
	.object({
		name: z.string().min(1, 'El nombre es obligatorio'),
		description: z.string().optional().nullable(),
		basePrice: z.number().positive('El precio base debe ser mayor a 0 USD'),
		categories: z.array(z.string()),
		classification: z.union([z.string().uuid(), z.string().min(1)]).optional(),
		parameters: z
			.array(examTypeParameterSchema)
			.min(1)
			.default([
				{
					position: 0,
					name: '',
					type: 'text', // | "number";
					category: undefined,
					unit: undefined,
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

export type ExamTypeSchema = typeof examTypeSchema;

export const editExamTypeParameterSchema = examTypeParameterSchema.extend({
	id: z.string().refine(uuidRefine, 'ID del tipo de exámen no válido').optional()
});

export const editExamTypeSchema = examTypeSchema.innerType().extend({
	id: z.string().refine(uuidRefine, 'ID del tipo de exámen no válido'),
	parameters: z.array(editExamTypeParameterSchema).min(1),
	deletedParameters: z.array(z.string().refine(uuidRefine, 'ID del parámetro inválido')).default([])
});

export const deleteExamTypeSchema = z.object({
	examTypeId: z.string().refine(uuidRefine, 'ID del tipo de exámen no válido')
});

export const createPatientSchema = z.object({
	firstName: z.string().min(1, 'El nombre es obligatorio'),
	lastName: z.string().min(1, 'El apellido es obligatorio'),
	documentId: z
		.number({ required_error: 'Debe ingresar la cédula del paciente' })
		.min(1, 'Debe ingresar una cédula válida')
		.max(maxDocumentId, 'Debe ingresar una cédula válida'),
	birthdate: z.string().min(1, 'Debe ingresar una fecha').date('No es una fecha valida'),
	email: z.string().email('Correo electrónico inválido').optional(),
	phoneNumber: z
		.string()
		.optional()
		.refine(
			(value) => {
				if (!value) return true; // Optional = OK
				const phone = parsePhoneNumberFromString(value, 'VE');
				return phone?.isValid();
			},
			{
				message: 'Número de teléfono inválido'
			}
		)
		.transform((value) => {
			if (!value) return undefined;
			const phone = parsePhoneNumberFromString(value, 'VE');

			// Fallback just in case because we already validate it
			if (!phone) return value;

			return phone.country === 'VE'
				? phone.formatNational().replace(/\s/g, '-')
				: phone.formatInternational();
		}),

	gender: z.nativeEnum(PatientGender, { errorMap: () => ({ message: 'Genero no válido' }) })
});

export const editPatientSchema = createPatientSchema.extend({
	patientId: z.string().refine(uuidRefine, 'ID del paciente no válido')
});

export const deletePatientSchema = z.object({
	patientId: z.string().refine(uuidRefine, 'ID del paciente no válido')
});

// EXAMS

const patientDiscriminatorSchema = z.discriminatedUnion('kind', [
	z.object({
		kind: z.literal('existing'),
		id: z
			.string({ message: 'Debe seleccionar un paciente' })
			.min(1, 'Debe seleccionar un paciente')
			.uuid()
	}),
	z.object({
		kind: z.literal('new'),
		data: createPatientSchema
	})
]);

export type PatientDiscriminator = z.infer<typeof patientDiscriminatorSchema>;

const customTagDiscriminatorSchema = z.discriminatedUnion('kind', [
	z.object({
		kind: z.literal('auto'),
		tag: z.null().optional()
	}),
	z.object({
		kind: z.literal('manual'),
		tag: z.string().min(1, 'Debe ingresar un identificador')
	})
]);

export const createExamSchema = z.object({
	patient: patientDiscriminatorSchema.default({ kind: 'existing', id: '' }),
	examTypeId: z.string({ message: 'Debe seleccionar un tipo de exámen' }).uuid(),
	customTag: customTagDiscriminatorSchema.default({ kind: 'auto', tag: null }),
	priority: z
		.nativeEnum(ExamPriority, { errorMap: () => ({ message: 'Prioridad no definida' }) })
		.default(ExamPriority.Normal)
	// NO Need for status when creating exam, always is ACTIVE by default on DB when missing
});

export const deleteExamSchema = z.object({
	examId: z.string().refine(uuidRefine, 'ID del exámen no es válido')
});

export const editExamDetailsSchema = z.object({
	examId: z.string().refine(uuidRefine, 'ID del exámen no es válido'),
	customTag: z.string().min(1, 'Debe ingresar un identificador'),
	priority: z
		.nativeEnum(ExamPriority, { errorMap: () => ({ message: 'Prioridad no definida' }) })
		.default(ExamPriority.Normal),
	status: z
		.nativeEnum(ExamStatus, { errorMap: () => ({ message: 'Estado no definido' }) })
		.default(ExamStatus.Pending)
});

export const editExamPaymentSchema = z.object({
	examId: z.string().refine(uuidRefine, 'ID del exámen no es válido'),
	/**
	 * When `paid` is set to `true`, the field `paidAt` should be assigned
	 */
	paid: z.boolean().default(false),
	pricePaid: z.number().nonnegative().optional(),
	paymentMethod: z
		.nativeEnum(PaymentMethod, { errorMap: () => ({ message: 'Método de pago no válido' }) })
		.optional(),
	paymentRef: z.string().optional()
});

export const editExamResulSchema = z.object({
	examId: z.string().refine(uuidRefine, 'ID del exámen no es válido'),
	sample: z.string().min(1, 'Debe ingresar una muestra').nullable().optional(),
	observation: z.string().optional().nullable(),
	// TODO: Think about how to match the results with the new `exam_result` table here
	results: z.record(z.any()).default({})
});
