import { db } from '$lib/server/db';
import {
	exam,
	examType,
	patient,
	patient as patientTable,
	exam as examTable
} from '$lib/server/db/schema';
import { eq, desc, count, sql } from 'drizzle-orm';

export const load = async () => {
	const lastExamsUpdated = await db
		.select({
			id: exam.id,
			priority: exam.priority,
			status: exam.status,
			paid: exam.paid,
			updatedAt: exam.updatedAt,
			patientName: sql<string>`${patient.firstName} || ' ' || ${patient.lastName}`.as(
				'patientName'
			),
			patientDocumentId: patient.documentId,
			examTypeName: examType.name
		})
		.from(exam)
		.innerJoin(patient, eq(patient.id, exam.patientId))
		.innerJoin(examType, eq(examType.id, exam.examTypeId))
		.orderBy(desc(exam.updatedAt))
		.limit(4);

	const lastPatientsUpdated = await db
		.select({
			id: patientTable.id,
			firstName: patientTable.firstName,
			lastName: patientTable.lastName,
			documentId: patientTable.documentId,
			createdAt: patientTable.createdAt,
			updateAt: patientTable.updatedAt,
			examCount: count(examTable.id).as('exam_count')
		})
		.from(patientTable)
		.leftJoin(examTable, eq(examTable.patientId, patientTable.id))
		.groupBy(patientTable.id)
		.orderBy(desc(patient.updatedAt))
		.limit(4);

	return { lastExamsUpdated, lastPatientsUpdated };
};
