import postgres from 'postgres';

export function isUniqueConstraintViolation(err: unknown, constraint?: string): boolean {
	// '23505' is the PostgreSQL error code for unique violation
	if (err instanceof postgres.PostgresError && err.code === '23505') {
		if (!constraint) return true;
		return err.constraint_name === constraint;
	}

	return false;
}
