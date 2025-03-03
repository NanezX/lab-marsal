import { db } from '$lib/server/db';
import { user, examType, lower } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { InferSelectModel } from 'drizzle-orm';
import type { PgTable } from 'drizzle-orm/pg-core';

/**
 * Find a user by email, with optional column exclusions.
 */
export async function findUserByEmail<E extends (keyof InferSelectModel<typeof user>)[]>(
	email: string,
	...excludes: E
): Promise<Omit<InferSelectModel<typeof user>, E[number]> | undefined> {
	// Perform select operation with exclusion
	const results = await db
		.select(selectWithout(user, excludes))
		.from(user)
		.where(eq(user.email, email.toLowerCase()));

	// Return the result with type
	return results.at(0) as Omit<InferSelectModel<typeof user>, E[number]> | undefined;
}

/**
 * Find a user by document ID, with optional column exclusions.
 */
export async function findUserByDocumentId<E extends (keyof InferSelectModel<typeof user>)[]>(
	documentId: number,
	...excludes: E
): Promise<Omit<InferSelectModel<typeof user>, E[number]> | undefined> {
	// Perform select operation with exclusion
	const results = await db
		.select(selectWithout(user, excludes))
		.from(user)
		.where(eq(user.documentId, documentId));

	// Return the result with type
	return results.at(0) as Omit<InferSelectModel<typeof user>, E[number]> | undefined;
}

export async function findExamTypeByName<E extends (keyof InferSelectModel<typeof examType>)[]>(
	name: string,
	...excludes: E
): Promise<Omit<InferSelectModel<typeof examType>, E[number]> | undefined> {
	const results = await db
		.select(selectWithout(examType, excludes))
		.from(examType)
		.where(eq(lower(examType.name), name.toLowerCase()));

	return results.at(0) as Omit<InferSelectModel<typeof examType>, E[number]> | undefined;
}

/**
 * Function to exclude specific columns from a table while keeping full type safety.
 * @param table - Drizzle table schema
 * @param excludedColumns - Array of column names to exclude
 * @returns Select object with only allowed columns
 */
function selectWithout<T extends PgTable, K extends keyof T['_']['columns']>(
	table: T,
	excludedColumns: K[]
) {
	return Object.fromEntries(
		Object.entries(table).filter(([key]) => !excludedColumns.includes(key as K))
	) as { [P in Exclude<keyof T['_']['columns'], K>]: T['_']['columns'][P] };
}
