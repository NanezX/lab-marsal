import { db } from '$lib/server/db';
import { patient, order } from '$lib/server/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
// import { exam, examType, patient, order } from '$lib/server/db/schema';
// import { eq, desc, count, sql } from 'drizzle-orm';

export const load = async () => {
	const lastExamsUpdated = await db
		.select({
			id: order.id,
			priority: order.priority,
			// status: order.status,
			paid: order.paid,
			updatedAt: order.updatedAt,
			patientName: sql<string>`${patient.firstName} || ' ' || ${patient.lastName}`.as(
				'patientName'
			),
			patientDocumentId: patient.documentId
		})
		.from(order)
		.where(eq(order.deleted, false))
		.innerJoin(patient, eq(patient.id, order.patientId))
		.orderBy(desc(order.updatedAt))
		.limit(4);

	const lastPatientsUpdated = await db
		.select({
			id: patient.id,
			firstName: patient.firstName,
			lastName: patient.lastName,
			documentId: patient.documentId,
			createdAt: patient.createdAt,
			updatedAt: patient.updatedAt,
			lastExamUpdate: sql`MAX(${order.updatedAt})`.as('last_exam_update'),
			effectiveUpdatedAt: sql`GREATEST(${patient.updatedAt}, MAX(${order.updatedAt}))`.as(
				'effective_updated_at'
			)
			// examCount: count(exam.id).as('exam_count')
		})
		.from(patient)
		.where(eq(patient.deleted, false))
		// .leftJoin(exam, eq(exam.patientId, patient.id))
		.groupBy(patient.id)
		.orderBy(sql`effective_updated_at DESC`)
		.limit(4);

	return { lastExamsUpdated, lastPatientsUpdated };
};
