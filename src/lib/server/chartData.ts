// src/lib/server/chartData.ts
import { db } from '$lib/server/db';
import { order, orderExamTypes, examType, patient } from '$lib/server/db/schema';
import { gte, sql, eq } from 'drizzle-orm';
import { subMonths } from 'date-fns';

export async function getChartData() {
	const oneMonthAgo = subMonths(new Date(), 1);

	// 1. Exam Types Distribution
	const examTypesData = await db
		.select({
			name: examType.name,
			count: sql<number>`count(${orderExamTypes.examTypeId})`.as('count')
		})
		.from(orderExamTypes)
		.innerJoin(order, eq(orderExamTypes.orderId, order.id))
		.innerJoin(examType, eq(orderExamTypes.examTypeId, examType.id))
		.where(gte(order.createdAt, oneMonthAgo))
		.groupBy(examType.name);

	// 2. Patient Age Distribution
	const ageData = await db
		.select({
			age: sql<number>`EXTRACT(YEAR FROM AGE(${patient.birthdate}))`.as('age')
		})
		.from(order)
		.innerJoin(patient, eq(order.patientId, patient.id))
		.where(gte(order.createdAt, oneMonthAgo));

	// Group ages into brackets
	const ageGroups = [
		{ label: '0-18', min: 0, max: 18, count: 0 },
		{ label: '19-30', min: 19, max: 30, count: 0 },
		{ label: '31-45', min: 31, max: 45, count: 0 },
		{ label: '46-60', min: 46, max: 60, count: 0 },
		{ label: '60+', min: 61, max: 200, count: 0 }
	];

	ageData.forEach(({ age }) => {
		const group = ageGroups.find((g) => age >= g.min && age <= g.max);
		if (group) group.count++;
	});

	return {
		examTypesData,
		ageGroups
	};
}
