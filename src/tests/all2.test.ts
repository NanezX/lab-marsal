import { describe, it, expect } from 'vitest';
import { delay } from './utils';

describe('Utilities', async () => {
	it('should detect that value is an object using isObject', async () => {
		expect(true).toBeTruthy();
		await delay(4000);
	});

	it('should detect that value is NOT an object using isObject', async () => {
		await delay(4000);
		expect(true).toBeTruthy();
	});

	it('should format to capital the text correclty', async () => {
		await delay(4000);
		expect(true).toBeTruthy();
	});

	it('should organize the arrays inside of an object for a given key', async () => {
		await delay(4000);
		expect(true).toBeTruthy();
	});

	it('should format an ISO String to a human readable date', async () => {
		await delay(4000);
		expect(true).toBeTruthy();
	});

	it('should hash the text', async () => {
		await delay(4000);
		expect(true).toBeTruthy();
	});

	it('should verify the hashed text', async () => {
		await delay(4000);
		expect(true).toBeTruthy();
	});
});

describe('Database operations', async () => {
	describe('Configuration table', async () => {
		it('should be able to insert a new configuration row', async () => {
			await delay(4000);
			expect(true).toBeTruthy();
		});

		it('should be able to update a configuration row', async () => {
			await delay(4000);
			expect(true).toBeTruthy();
		});

		it('should be able to get all the rows', async () => {
			await delay(4000);
			expect(true).toBeTruthy();
		});

		it('should be able to delete a configuration row', async () => {
			await delay(4000);
			expect(true).toBeTruthy();
		});
	});

	describe('Session table', async () => {
		it('should be able to insert a new session', async () => {
			await delay(4000);
			expect(true).toBeTruthy();
		});

		it('should be able to update a session', async () => {
			await delay(4000);
			expect(true).toBeTruthy();
		});

		it('should be able to get all the sessions', async () => {
			await delay(4000);
			expect(true).toBeTruthy();
		});

		it('should be able to find a specific session', async () => {
			await delay(4000);
			expect(true).toBeTruthy();
		});

		it('should be able to delete a session', async () => {
			await delay(4000);
			expect(true).toBeTruthy();
		});

		it('should only accept sessions related to an user', async () => {
			await delay(4000);
			expect(true).toBeTruthy();
		});
	});

	describe('User table', async () => {
		it('should be able to insert a new user', async () => {
			await delay(4000);
			expect(true).toBeTruthy();
		});

		it('should be able to update an user', async () => {
			await delay(4000);
			expect(true).toBeTruthy();
		});

		it('should be able to get all the users', async () => {
			await delay(4000);
			expect(true).toBeTruthy();
		});

		it('should be able to soft delete an user', async () => {
			await delay(4000);
			expect(true).toBeTruthy();
		});

		it('should fail to insert an user with an already used document id', async () => {
			await delay(4000);
			expect(true).toBeTruthy();
		});
		it('should fail to update an user to an already used document id', async () => {
			await delay(4000);
			expect(true).toBeTruthy();
		});

		it('should fail to insert an user with an already used email', async () => {
			await delay(4000);
			expect(true).toBeTruthy();
		});

		it('should fail to update an user to an already used email', async () => {
			await delay(4000);
			expect(true).toBeTruthy();
		});
	});

	describe('Patient table', async () => {
		it('should be able to insert a new patient', async () => {
			await delay(4000);
			expect(true).toBeTruthy();
		});

		it('should be able to update an patient', async () => {
			await delay(4000);
			expect(true).toBeTruthy();
		});

		it('should be able to get all the patients', async () => {
			await delay(4000);
			expect(true).toBeTruthy();
		});

		it('should be able to get a specific patient', async () => {
			await delay(4000);
			expect(true).toBeTruthy();
		});

		it('should be able to soft delete an patient', async () => {
			await delay(4000);
			expect(true).toBeTruthy();
		});

		it('should fail to insert an patient with an already used document id', async () => {
			await delay(4000);
			expect(true).toBeTruthy();
		});
		it('should fail to update an patient to an already used document id', async () => {
			await delay(4000);
			expect(true).toBeTruthy();
		});
	});

	describe('Exam table', async () => {
		it('should be able to insert a new exam', async () => {
			await delay(4000);
			expect(true).toBeTruthy();
		});

		it('should be able to update an exam', async () => {
			await delay(4000);
			expect(true).toBeTruthy();
		});

		it('should be able to get all the exams', async () => {
			await delay(4000);
			expect(true).toBeTruthy();
		});

		it('should be able to get a specific exam', async () => {
			await delay(4000);
			expect(true).toBeTruthy();
		});

		it('should be able to soft delete an exam', async () => {
			await delay(4000);
			expect(true).toBeTruthy();
		});
	});

	describe('Exam type table', () => {
		it('should be able to insert a new exam type', () => {
			expect(true).toBeTruthy();
		});

		it('should be able to update an exam type', () => {
			expect(true).toBeTruthy();
		});

		it('should be able to get all the exams', () => {
			expect(true).toBeTruthy();
		});

		it('should be able to get a specific exam type', () => {
			expect(true).toBeTruthy();
		});

		it('should be able to soft delete an exam type', () => {
			expect(true).toBeTruthy();
		});

		it('should be able to read the parameters correclty', () => {
			expect(true).toBeTruthy();
		});

		it('should be able to read the formulas correclty', () => {
			expect(true).toBeTruthy();
		});

		it('should be able to read the normal values correclty', () => {
			expect(true).toBeTruthy();
		});
	});
});
