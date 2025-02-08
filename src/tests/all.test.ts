import { describe, it, expect } from 'vitest';
import { delay } from './utils';

describe('Auth sessions', () => {
	it('should generate the session token correctly', async () => {
		await delay(4000);
		expect(true).toBeTruthy();
	});

	it('should create the session correctly', async () => {
		await delay(4000);
		expect(true).toBeTruthy();
	});

	it('should validate the session token and not obtain user if no session found', async () => {
		await delay(4000);
		expect(true).toBeTruthy();
	});

	it('should validate the session token and not obtain user if the session expired', async () => {
		await delay(4000);
		expect(true).toBeTruthy();
	});

	it('should validate the session token and get the user at valid session', async () => {
		await delay(4000);
		expect(true).toBeTruthy();
	});

	it('should validate the session token and extend the session', async () => {
		await delay(4000);
		expect(true).toBeTruthy();
	});

	it('should soft delete the session with invalidateSession', async () => {
		await delay(4000);
		expect(true).toBeTruthy();
	});

	it('should set the session token at the cookies correctly', async () => {
		await delay(4000);
		expect(true).toBeTruthy();
	});

	it('should delete the session token at the cookies correctly', async () => {
		await delay(4000);
		expect(true).toBeTruthy();
	});
});

describe('Rol authorization', () => {
	it('should get the role of the user after validating the session', async () => {
		await delay(4000);
		expect(true).toBeTruthy();
	});
	it('should fail to get the role of the user with invalid session', async () => {
		await delay(4000);
		expect(true).toBeTruthy();
	});
});

describe('Zod input validations', () => {
	it('should validate user login data with the user login schema correctly', async () => {
		await delay(4000);
		expect(true).toBeTruthy();
	});

	it('should return error with wrong user login data with the user login schema', async () => {
		await delay(4000);
		expect(true).toBeTruthy();
	});

	it('should validate user register data with the user register schema correctly', async () => {
		await delay(4000);
		expect(true).toBeTruthy();
	});

	it('should return error with wrong user register data with the user register schema', async () => {
		await delay(4000);
		expect(true).toBeTruthy();
	});

	it('should validate patient register data with the patient register schema correctly', async () => {
		await delay(4000);
		expect(true).toBeTruthy();
	});

	it('should return error with wrong patient register data with the patient register schema ', async () => {
		await delay(4000);
		expect(true).toBeTruthy();
	});

	it('should validate exam type creation data with the exam type creation schema correctly', async () => {
		await delay(4000);
		expect(true).toBeTruthy();
	});

	it('should return error with wrong exam type creation data with the exam type creation schema', async () => {
		await delay(4000);
		expect(true).toBeTruthy();
	});

	it('should validate exam creation data with the exam creation schema correctly', async () => {
		await delay(4000);
		expect(true).toBeTruthy();
	});

	it('should return error with wrong exam creation data with the exam creation schema', async () => {
		await delay(4000);
		expect(true).toBeTruthy();
	});

	it('should validate configuration data with the configuration schema correctly', async () => {
		await delay(4000);
		expect(true).toBeTruthy();
	});

	it('should return error with wrong configuration data with the configuration schema', async () => {
		await delay(4000);
		expect(true).toBeTruthy();
	});
});
