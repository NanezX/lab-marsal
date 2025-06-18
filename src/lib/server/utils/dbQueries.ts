import { db } from '$lib/server/db';
import {
	user,
	examType,
	patient as patientTable,
	lower,
	parameter,
	examTypeClassification
} from '$lib/server/db/schema';
import { normalized } from '$lib/shared/utils';
import { and, eq } from 'drizzle-orm';
import type { ExtractTablesWithRelations, InferSelectModel } from 'drizzle-orm';
import type { PgTable, PgTransaction } from 'drizzle-orm/pg-core';
import type { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js';
import { validate as validateUUID } from 'uuid';

type TxType = PgTransaction<
	PostgresJsQueryResultHKT,
	typeof import('$lib/server/db/schema'),
	ExtractTablesWithRelations<typeof import('$lib/server/db/schema')>
>;

/**
 * Get the classification ID or create it if not found.
 *
 * This could receive an ID of UUID type, but it would NOT verify that exist on the Classification table
 */
export async function getOrCreateClassification(
	input: string | undefined,

	tx: TxType
): Promise<string> {
	if (!input) {
		input = 'Sin clasificación';
	}

	let classificationId: string | null = null;

	if (validateUUID(input)) {
		// It's an uuid
		classificationId = input;
	} else {
		// It's a text (a name)
		const name = input;
		const nameNormalized = normalized(input);

		// Try to find existing by name on the classification table
		const existingClas = await tx.query.examTypeClassification.findFirst({
			columns: { id: true },
			where: (clasTable, { eq }) => eq(clasTable.nameNormalized, nameNormalized)
		});

		// If found, then use the ID
		if (existingClas) {
			classificationId = existingClas.id;
		} else {
			// If no classification found, then create it
			const inserted = await tx
				.insert(examTypeClassification)
				.values({ name, nameNormalized })
				.returning({ id: examTypeClassification.id });

			classificationId = inserted[0].id;
		}
	}

	return classificationId;
}

export async function generateNextExamTag(tx: TxType) {
	const latestExam = await tx.query.exam.findFirst({
		where: (exam, { like }) => like(exam.customTag, 'EX-%'),
		orderBy: (exam, { desc }) => desc(exam.customTag)
	});

	const lastNumber = latestExam ? parseInt(latestExam.customTag.split('-')[1], 10) : 0;

	const nextNumber = String(lastNumber + 1).padStart(4, '0');
	return `EX-${nextNumber}`;
}

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
		.where(eq(lower(examType.nameNormalized), normalized(name)));

	return results.at(0) as Omit<InferSelectModel<typeof examType>, E[number]> | undefined;
}

export async function findExamTypeById(id: string) {
	return await db.query.examType.findFirst({
		columns: {
			deleted: false
		},
		where: and(eq(examType.id, id), eq(examType.deleted, false)),
		with: {
			classification: {
				columns: {
					name: true
				}
			},
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

export async function findPatientById<E extends (keyof InferSelectModel<typeof patientTable>)[]>(
	id: string,
	...excludes: E
): Promise<Omit<InferSelectModel<typeof patientTable>, E[number]> | undefined> {
	const results = await db
		.select(selectWithout(patientTable, excludes))
		.from(patientTable)
		.where(and(eq(patientTable.id, id), eq(patientTable.deleted, false)));

	return results.at(0) as Omit<InferSelectModel<typeof patientTable>, E[number]> | undefined;
}

export async function findExamById(id: string) {
	return await db.query.exam.findFirst({
		where: (examTable, { and, eq }) => and(eq(examTable.id, id), eq(examTable.deleted, false)),
		columns: {
			deleted: false,
			patientId: false,
			examTypeId: false
		},
		with: {
			patient: {
				columns: {
					id: true,
					firstName: true,
					lastName: true,
					documentId: true,
					gender: true
				}
			},
			examType: {
				columns: {
					id: true,
					name: true,
					basePrice: true,
					categories: true
				},
				with: {
					parameters: {
						where: (parameter, { eq }) => eq(parameter.deleted, false),
						orderBy: (parameters, { asc }) => [asc(parameters.position)],
						columns: {
							deleted: false,
							createdAt: false,
							updatedAt: false,
							examTypeId: false
						}
					},
					classification: {
						columns: {
							name: true
						}
					}
				}
			}
		}
	});
}

export async function getAllExamTypeClassifications() {
	return await db.query.examTypeClassification.findMany({
		columns: {
			id: true,
			name: true
		},
		where: (c, { eq }) => eq(c.deleted, false)
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
