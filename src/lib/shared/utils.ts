import type { Dictionary } from 'lodash';
import { chain, sortBy } from 'lodash-es';
import type { ExamTypeWithParameters } from './types';

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
			unit: p.unit,
			hasReferences: p.hasReferences,
			referenceValues: p.referenceValues
		})),
		deletedParameters: []
	};
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
