import type { findExamTypeById } from '$lib/server/utils/dbQueries';

// Get the return type of `findExamTypeById`
type ExamTypeWithParameters = NonNullable<Awaited<ReturnType<typeof findExamTypeById>>>;

// Extract the `Parameter` type from the `parameters` array
export type Parameter = ExamTypeWithParameters['parameters'][number];
