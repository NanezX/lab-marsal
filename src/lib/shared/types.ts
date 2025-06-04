import type { patient as patientTable } from '$lib/server/db/schema';
import type { findExamTypeById, findPatientById, findExamById } from '$lib/server/utils/dbQueries';
import type { InferSelectModel } from 'drizzle-orm';

// Get the return type of `findExamTypeById`
export type ExamTypeWithParameters = NonNullable<Awaited<ReturnType<typeof findExamTypeById>>>;

// Extract the `Parameter` type from the `parameters` array
export type Parameter = ExamTypeWithParameters['parameters'][number];

export type PatientKey = keyof InferSelectModel<typeof patientTable>;

export type Patient<E extends PatientKey[] = []> = NonNullable<
	Awaited<ReturnType<typeof findPatientById<E>>>
>;


export type FindExamData = NonNullable<Awaited<ReturnType<typeof findExamById>>>;
