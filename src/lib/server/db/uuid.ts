import { v4 as uuidv4, v5 as uuidv5 } from 'uuid';

export const Namespaces = {
	Patient: 'd6c5a0e8-6b1a-4f9a-9c8b-1d7f3a6b9c0d',
	Exam: 'f8d3b9a0-2e7b-4a1c-9d2e-5f3a6b1c8d9e',
	User: 'a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6'
} as const;

type ValidNamespace = typeof Namespaces[keyof typeof Namespaces];

export function generateRandomUUID() {
	return uuidv4();
}

/**
 * Generate a UUID based on the value and namesapce using uuid V5.
 * If `whitespaces` is true, the whitespaces are removed from the input before generating the UUID output.
 *
 * The UUID generate is totally deterministic.
 * @param value
 * @param namespace
 * @returns
 */
export function generateFromNameUUID(
	value: string,
	namespace: ValidNamespace,
	whitespaces = false
) {
	if (!whitespaces) {
		value = value.replace(' ', '');
	}
	return uuidv5(value, namespace);
}
