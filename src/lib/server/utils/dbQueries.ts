import { db } from '$lib/server/db';
import {
	user,
	exam as examTable,
	examType,
	patient as patientTable,
	lower,
	parameter
} from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
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

export async function findExamTypeById(id: string) {
	return await db.query.examType.findFirst({
		columns: {
			deleted: false
		},
		where: and(eq(examType.id, id), eq(examType.deleted, false)),
		with: {
			parameters: {
				where: eq(parameter.deleted, false),
				columns: {
					deleted: false,
					createdAt: false,
					examTypeId: false
				},
				orderBy: (parameters, { asc }) => [asc(parameters.position)]
			}
		}
	});
}

export async function findPatientByDocumentId<
	E extends (keyof InferSelectModel<typeof patientTable>)[]
>(
	documentId: number,
	...excludes: E
): Promise<Omit<InferSelectModel<typeof patientTable>, E[number]> | undefined> {
	const results = await db
		.select(selectWithout(patientTable, excludes))
		.from(patientTable)
		.where(eq(patientTable.documentId, documentId));

	return results.at(0) as Omit<InferSelectModel<typeof patientTable>, E[number]> | undefined;
}

export async function findPatientById(id: string) {
	return await db.query.patient.findFirst({
		columns: {
			deleted: false,
			firstNameNormalized: false,
			lastNameNormalized: false,
		},
		where: and(eq(patientTable.id, id), eq(patientTable.deleted, false)),
		with: {
			exams: {
				where: eq(examTable.deleted, false),
				limit: 5,
				orderBy: (exams, { desc }) => [desc(exams.createdAt)],
				columns: {
					priority: true,
					status: true,
					paid: true,
					createdAt: true,
				},
				with: {
					examType: {
						columns: {
							name: true
						}
					}
				},
			}
		}
	});
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
