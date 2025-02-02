import { z } from 'zod';
import { UserRoles } from '../db/schema';

export const UserLoginSchema = z.object({
	email: z.string().min(1, 'Correo electrónico obligatorio').email('Correo electrónico inválido'),
	password: z
		.string()
		.min(8, 'La contraseña debe tener al menos 8 caracteres')
		.max(20, 'La contraseña debe tener máximo 20 caracteres')
});

export const UserRegisterSchema = UserLoginSchema.extend({
	name: z.string().min(1, 'Nombre es obligatario'),
	lastName: z.string().min(1, 'Apellido es obligatario'),
	role: z.nativeEnum(UserRoles, { errorMap: () => ({ message: 'Rol no valido' }) })
});
