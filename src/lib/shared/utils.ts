import type { Dictionary } from 'lodash';
import { chain } from 'lodash-es';

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

export const minDocumentId = 0;
export const maxDocumentId = 999999999;
