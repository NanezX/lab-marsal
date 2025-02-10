import { UserRoles } from '$lib/shared/enums';
import { minDocumentId, maxDocumentId } from '$lib/shared/utils';
import { z } from 'zod';

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
		.refine((value_) => {
			// Get the current date
			const minAgeDate = new Date();
			//  Set full date minus 18 years
			minAgeDate.setFullYear(minAgeDate.getFullYear() - 18);
			// Get a new date instance using the passed date
			const inputDate = new Date(value_);
			return inputDate <= minAgeDate;
		}, 'Debe tener mínimo 18 años')
}).refine((obj) => obj.password === obj.repeatPassword, {
	message: 'Las contraseñas no coinciden',
	path: ['repeatPassword']
});

export const PasswordRecoverySchema = z.object({
	email: z.string().min(1, 'Correo electrónico obligatorio').email('Correo electrónico inválido')
});
