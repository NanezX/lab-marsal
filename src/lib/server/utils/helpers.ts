import postgres from 'postgres';

export function isUniqueConstraintViolation(err: unknown, constraint?: string): boolean {
	if (err instanceof postgres.PostgresError) {
		if (!constraint) return true;
		return err.constraint_name === constraint;
	}

	return false;
}
