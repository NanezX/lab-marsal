export class AppLaboratoryError extends Error {
	public status: number;
	public code: string;

	constructor(message: string, options?: { status?: number; code?: string }) {
		super(message);

		this.status = options?.status ?? 400;
		this.code = options?.code ?? 'APP_ERROR';

		Object.setPrototypeOf(this, new.target.prototype);
	}
}

export class AppInvalidDatabaseURLError extends AppLaboratoryError {
	constructor(message?: string) {
		super(message ?? 'DATABASE_URL is not defined', { status: 500, code: 'INVALID_DATABASE_URL' });
	}
}

export class AppSendEmailError extends AppLaboratoryError {
	constructor() {
		super('Failed to send email', { status: 500, code: 'INVALID_DATABASE_URL' });
	}
}

export class AppDataNotSavedError extends AppLaboratoryError {
	constructor(message?: string) {
		super(message ?? 'Data not saved', { status: 500, code: 'DATA_NOT_SAVED' });
	}
}
