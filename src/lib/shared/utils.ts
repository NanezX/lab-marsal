import type { Dictionary } from 'lodash';
import { chain, sortBy } from 'lodash-es';
import type { ExamTypeWithParameters, FindExamData, FindOrderData, Patient } from './types';
import { UserRoles } from './enums';
import type { SessionValidationResult } from '$lib/server/auth';

export function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Format a text to capital letter
 * @param text The text to format, eg: "helLo WorLD!"
 * @returns The texted formatted with capital letter, eg: "Hello world!"
 */
export function formatCapital(text: string): string {
	return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function generateName(
	baseName: string,
	baseNumber: number,
	validate: (name: string) => boolean
): string {
	const newCategory = `${baseName} ${baseNumber}`;

	if (validate(newCategory)) {
		// If this name already exist, create a diffrent one
		return generateName(baseName, baseNumber + 1, validate);
	}

	return newCategory;
}

export function deleteAndReindex<T>(
	obj: Record<string, T>,
	keyToDelete: number | string
): Dictionary<T> {
	// Convert keyToDelete to string to match object keys
	const keyStr = String(keyToDelete);

	return chain(obj)
		.toPairs()
		.filter(([key]) => key !== keyStr) // Remove the target key
		.map(([_, value], newIndex) => [String(newIndex), value]) // Reindex
		.fromPairs()
		.value();
}

export function sortArrayObject<T>(data: Array<T>, key: string): Array<T> {
	return sortBy(data, [key]);
}

export const minDocumentId = 1;
export const maxDocumentId = 999999999;

export function cleanEditExamTypeData(data: ExamTypeWithParameters) {
	return {
		id: data.id,
		name: data.name,
		description: data.description ?? undefined,
		basePrice: parseFloat(data.basePrice),
		categories: data.categories,
		parameters: data.parameters.map((p) => ({
			id: p.id,
			position: p.position,
			name: p.name,
			type: 'text' as const,
			category: p.category ?? undefined,
			unit: p.unit ?? undefined,
			hasReferences: p.hasReferences,
			referenceValues: p.referenceValues
		})),
		classification: data.classificationId,
		deletedParameters: []
	};
}

export function cleanEditPatientData(
	data: Patient<['firstNameNormalized', 'lastNameNormalized', 'deleted']>
) {
	return {
		patientId: data.id,
		firstName: data.firstName,
		lastName: data.lastName,
		documentId: data.documentId ?? undefined,
		birthdate: data.birthdate.toISOString().split('T')[0], // This is to only to format date from '1998-11-17T00:00:00.000Z' to '1998-11-17'
		email: data.email ?? undefined,
		phoneNumber: data.phoneNumber ?? undefined,
		gender: data.gender
	};
}

export function cleanEditUserProfileData(data: NonNullable<SessionValidationResult['user']>) {
	return {
		firstName: data.firstName,
		lastName: data.lastName,
		email: data.email,
		documentId: data.documentId,
		birthdate: data.birthdate.toISOString().split('T')[0] // This is to only to format date from '1998-11-17T00:00:00.000Z' to '1998-11-17'
	};
}

export function cleanEditUserData(data: {
	email: string;
	role: UserRoles;
	documentId: number;
	[key: string]: string | number | boolean;
}) {
	return {
		email: data.email,
		role: data.role,
		documentId: data.documentId
	};
}

export function cleanEditExamDetails(data: FindExamData) {
	return {
		examId: data.id,
		customTag: data.customTag,
		priority: data.priority,
		status: data.status
	};
}

export function cleanEditOrderDetails(data: FindOrderData) {
	return {
		orderId: data.id,
		priority: data.priority,
		delivered: data.deliveredAt ? 'Entregado' : 'No entregado'
	};
}

export function cleanEditOrderPayment(data: FindOrderData) {
	const base = {
		orderId: data.id,
		paid: data.paid
	};

	if (!data.paid) {
		return {
			...base,
			paymentMethod: undefined,
			pricePaid: undefined,
			paymentRef: undefined
		};
	}

	return {
		...base,
		paymentMethod: data.paymentMethod ?? undefined,
		pricePaid: toNumberOrUndefined(data.pricePaid),
		paymentRef: data.paymentRef ?? undefined
	};
}

export function cleanEditExamResults(data: FindExamData) {
	const results = data.results.map((result_) => ({
		id: result_.id,
		parameterId: result_.parameterId,
		value: result_.value
	}));

	// If no results were saved befoe, we could consider any changes on the exam type parameters.
	// If resulst are present previusly, we skip the exam type parameters since anyone could add them or edit them after the exam completed
	if (results.length === 0) {
		data.examType.parameters.forEach((parameter) => {
			// If the parameter is not in the results, we add it with an empty value
			if (!results.some((result) => result.parameterId === parameter.id)) {
				results.push({
					id: '', // This will be considred as false on the if statement
					parameterId: parameter.id,
					value: ''
				});
			}
		});
	}

	return {
		examId: data.id,
		sample: data.sample,
		observation: data.observation,
		results
		// results: data.results.map((result_) => ({
		// 	id: result_.id,
		// 	parameterId: result_.parameterId,
		// 	value: result_.value
		// }))
	};
}

// Convert string | null to number | undefined
export function toNumberOrUndefined(value: string | null): number | undefined {
	if (value === null) return undefined;
	const num = Number(value);
	return isNaN(num) ? undefined : num;
}

// Convert number | undefined to string | null (for database/storage)
export function toStringOrNull(value: number | undefined): string | null {
	return value?.toString() ?? null;
}

/**
 * Normalizes a string by removing diacritical marks (accents) and converting it to lowercase.
 *
 * This function uses Unicode normalization form 'NFD' to decompose combined characters,
 * then removes all diacritical marks using a regular expression, and finally converts
 * the result to lowercase.
 *
 * @param s - The input string to normalize.
 * @returns The normalized string, stripped of diacritics and in lowercase.
 */
export const normalized = (s: string) =>
	s
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase();

export const roleMinimums: Partial<Record<UserRoles, number>> = {
	[UserRoles.Admin]: 1
	// [UserRoles.Secretaria]: 2, // add more roles in the future
};

export function snakeToCamel(str: string): string {
	return str.replace(/(_\w)/g, (match) => match[1].toUpperCase());
}

export function toSnakeCase(str: string): string {
	return (
		str
			// Insert underscore between lowercase and uppercase
			.replace(/([a-z\d])([A-Z])/g, '$1_$2')
			// Insert underscore between uppercase and lowercase
			.replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1_$2')
			// Replace all non-word characters with underscores
			.replace(/[-\s]+/g, '_')
			// Convert to lowercase
			.toLowerCase()
	);
}
