import { ExamPriority, PatientGender, UserRoles, ExamStatus } from '../shared/enums';
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
