import { db } from '$lib/server/db';
import { exam, examType, patient } from '$lib/server/db/schema';
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
		.where(eq(exam.deleted, false))
		.innerJoin(patient, eq(patient.id, exam.patientId))
		.innerJoin(examType, eq(examType.id, exam.examTypeId))
		.orderBy(desc(exam.updatedAt))
		.limit(4);

	const lastPatientsUpdated = await db
		.select({
			id: patient.id,
			firstName: patient.firstName,
			lastName: patient.lastName,
			documentId: patient.documentId,
			createdAt: patient.createdAt,
			updatedAt: patient.updatedAt,
			lastExamUpdate: sql`MAX(${exam.updatedAt})`.as('last_exam_update'),
			effectiveUpdatedAt: sql`GREATEST(${patient.updatedAt}, MAX(${exam.updatedAt}))`.as(
				'effective_updated_at'
			),
			examCount: count(exam.id).as('exam_count')
		})
		.from(patient)
		.where(eq(patient.deleted, false))
		.leftJoin(exam, eq(exam.patientId, patient.id))
		.groupBy(patient.id)
		.orderBy(sql`effective_updated_at DESC`)
		.limit(4);

	return { lastExamsUpdated, lastPatientsUpdated };
};
