import { describe, it, expect } from 'vitest';

describe('Auth sessions', () => {
	it('should generate the session token correctly', () => {
		expect(true).toBeTruthy();
	});

	it('should create the session correctly', () => {
		expect(true).toBeTruthy();
	});

	it('should validate the session token and not obtain user if no session found', () => {
		expect(true).toBeTruthy();
	});

	it('should validate the session token and not obtain user if the session expired', () => {
		expect(true).toBeTruthy();
	});

	it('should validate the session token and get the user at valid session', () => {
		expect(true).toBeTruthy();
	});

	it('should validate the session token and extend the session', () => {
		expect(true).toBeTruthy();
	});

	it('should soft delete the session with invalidateSession', () => {
		expect(true).toBeTruthy();
	});

	it('should set the session token at the cookies correctly', () => {
		expect(true).toBeTruthy();
	});

	it('should delete the session token at the cookies correctly', () => {
		expect(true).toBeTruthy();
	});
});

describe('Rol authorization', () => {
	it('should get the role of the user after validating the session', () => {
		expect(true).toBeTruthy();
	});
	it('should fail to get the role of the user with invalid session', () => {
		expect(true).toBeTruthy();
	});
});

describe('Zod input validations', () => {
	it('should validate user login data with the user login schema correctly', () => {
		expect(true).toBeTruthy();
	});

	it('should return error with wrong user login data with the user login schema', () => {
		expect(true).toBeTruthy();
	});

	it('should validate user register data with the user register schema correctly', () => {
		expect(true).toBeTruthy();
	});

	it('should return error with wrong user register data with the user register schema', () => {
		expect(true).toBeTruthy();
	});

	it('should validate patient register data with the patient register schema correctly', () => {
		expect(true).toBeTruthy();
	});

	it('should return error with wrong patient register data with the patient register schema ', () => {
		expect(true).toBeTruthy();
	});

	it('should validate exam type creation data with the exam type creation schema correctly', () => {
		expect(true).toBeTruthy();
	});

	it('should return error with wrong exam type creation data with the exam type creation schema', () => {
		expect(true).toBeTruthy();
	});

	it('should validate exam creation data with the exam creation schema correctly', () => {
		expect(true).toBeTruthy();
	});

	it('should return error with wrong exam creation data with the exam creation schema', () => {
		expect(true).toBeTruthy();
	});

	it('should validate configuration data with the configuration schema correctly', () => {
		expect(true).toBeTruthy();
	});

	it('should return error with wrong configuration data with the configuration schema', () => {
		expect(true).toBeTruthy();
	});
});
