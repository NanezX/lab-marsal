/**
 * User Roles in the app
 */
export enum UserRoles {
	Secretaria = 'secretaria',
	Auxiliar = 'auxiliar',
	Bioanalista = 'bioanalista',
	Admin = 'administrador'
}

/**
 * Exam priority in the app
 */
export enum ExamPriority {
	Low = 'low',
	Normal = 'normal',
	High = 'high'
}

/**
 * Exam status in the app
 */
export enum ExamStatus {
	Cancelled = 'cancelled',
	Pending = 'pending',
	Ready = 'ready', // This if for ready to be deliver
	Completed = 'completed'
}

/**
 * Patient gender in the app
 */
export enum PatientGender {
	Male = 'male',
	Female = 'female'
}

export enum PaymentMethod {
	PuntoDeVenta = 'punto_de_venta',
	PagoMovil = 'pago_movil',
	EfectivoBolivares = 'efectivo_bs',
	EfectivoDolares = 'efectivo_dolares',
	Otro = 'otro'
}
