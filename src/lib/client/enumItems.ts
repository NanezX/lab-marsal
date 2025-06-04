import { ExamPriority, PatientGender, UserRoles } from '../shared/enums';
import { formatCapital } from '../shared/utils';

export const userRolesItems = Object.values(UserRoles).map((role_) => ({
	value: role_,
	label: formatCapital(role_)
}));

export const priorityItems = Object.values(ExamPriority).map((priority_) => ({
	value: priority_,
	label: formatCapital(
		priority_ === ExamPriority.Low ? 'Baja' : priority_ === ExamPriority.High ? 'Alta' : 'Normal'
	)
}));

export const patientGenderItems = Object.values(PatientGender).map((role_) => ({
	value: role_,
	label: formatCapital(role_ === PatientGender.Female ? 'Mujer' : 'Hombre')
}));
