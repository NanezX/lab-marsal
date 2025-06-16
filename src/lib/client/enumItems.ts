import { ExamPriority, PatientGender, UserRoles, ExamStatus, PaymentMethod } from '../shared/enums';
import { formatCapital } from '../shared/utils';

/**
 * Items for User Roles
 */
export const userRolesItems = Object.values(UserRoles).map((role_) => ({
	value: role_,
	label: formatCapital(role_)
}));

/**
 * Item for priority
 */
export const priorityItems = Object.values(ExamPriority).map((priority_) => ({
	value: priority_,
	label: formatCapital(
		priority_ === ExamPriority.Low ? 'Baja' : priority_ === ExamPriority.High ? 'Alta' : 'Normal'
	)
}));

const statusLabels: Record<ExamStatus, string> = {
	[ExamStatus.Cancelled]: 'Cancelado',
	[ExamStatus.Pending]: 'En progreso',
	[ExamStatus.Ready]: 'Listo para entregar',
	[ExamStatus.Completed]: 'Completado'
};

/**
 * Items for the exam status
 */
export const examStatusItems = Object.entries(statusLabels).map(([value, label]) => ({
	value: value as ExamStatus,
	label: formatCapital(label)
}));

/**
 * Items for Gender
 */
export const patientGenderItems = Object.values(PatientGender).map((role_) => ({
	value: role_,
	label: formatCapital(role_ === PatientGender.Female ? 'Mujer' : 'Hombre')
}));

/**
 * Items for exam paid
 */
export const examPaidItems = [
	{
		value: false,
		label: 'No pagado'
	},
	{ value: true, label: 'Pagado' }
];

export const paymentMethodLabels: Record<PaymentMethod | 'unselected', string> = {
	[PaymentMethod.PuntoDeVenta]: 'Punto de Venta',
	[PaymentMethod.PagoMovil]: 'Pago Móvil',
	[PaymentMethod.EfectivoBolivares]: 'Efectivo (Bs)',
	[PaymentMethod.EfectivoDolares]: 'Efectivo ($)',
	[PaymentMethod.Otro]: 'Otro método',
	unselected: 'No seleccionado'
};

export const examPaymentMethodItems = [
	{ value: undefined, label: paymentMethodLabels.unselected },
	...Object.values(PaymentMethod).map((method) => ({
		value: method,
		label: paymentMethodLabels[method]
	}))
];
