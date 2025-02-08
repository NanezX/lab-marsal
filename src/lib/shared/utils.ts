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

export const minDocumentId = 0;
export const maxDocumentId = 999999999;
