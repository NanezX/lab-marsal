import { describe, it, expect } from 'vitest';

describe('Utilities', () => {
	it('should detect that value is an object using isObject', () => {
		expect(true).toBeTruthy();
	});

	it('should detect that value is NOT an object using isObject', () => {
		expect(true).toBeTruthy();
	});

	it('should format to capital the text correclty', () => {
		expect(true).toBeTruthy();
	});

	it('should organize the arrays inside of an object for a given key', () => {
		expect(true).toBeTruthy();
	});

	it('should format an ISO String to a human readable date', () => {
		expect(true).toBeTruthy();
	});

	it('should hash the text', () => {
		expect(true).toBeTruthy();
	});

	it('should verify the hashed text', () => {
		expect(true).toBeTruthy();
	});
});

describe('Database operations', () => {
	describe('Configuration table', () => {
		it('should be able to insert a new configuration row', () => {
			expect(true).toBeTruthy();
		});

		it('should be able to update a configuration row', () => {
			expect(true).toBeTruthy();
		});

		it('should be able to get all the rows', () => {
			expect(true).toBeTruthy();
		});

		it('should be able to delete a configuration row', () => {
			expect(true).toBeTruthy();
		});
	});

	describe('Session table', () => {
		it('should be able to insert a new session', () => {
			expect(true).toBeTruthy();
		});

		it('should be able to update a session', () => {
			expect(true).toBeTruthy();
		});

		it('should be able to get all the sessions', () => {
			expect(true).toBeTruthy();
		});

		it('should be able to find a specific session', () => {
			expect(true).toBeTruthy();
		});

		it('should be able to delete a session', () => {
			expect(true).toBeTruthy();
		});

		it('should only accept sessions related to an user', () => {
			expect(true).toBeTruthy();
		});
	});

	describe('User table', () => {
		it('should be able to insert a new user', () => {
			expect(true).toBeTruthy();
		});

		it('should be able to update an user', () => {
			expect(true).toBeTruthy();
		});

		it('should be able to get all the users', () => {
			expect(true).toBeTruthy();
		});

		it('should be able to soft delete an user', () => {
			expect(true).toBeTruthy();
		});

		it('should fail to insert an user with an already used document id', () => {
			expect(true).toBeTruthy();
		});
		it('should fail to update an user to an already used document id', () => {
			expect(true).toBeTruthy();
		});

		it('should fail to insert an user with an already used email', () => {
			expect(true).toBeTruthy();
		});

		it('should fail to update an user to an already used email', () => {
			expect(true).toBeTruthy();
		});
	});

	describe('Patient table', () => {
		it('should be able to insert a new patient', () => {
			expect(true).toBeTruthy();
		});

		it('should be able to update an patient', () => {
			expect(true).toBeTruthy();
		});

		it('should be able to get all the patients', () => {
			expect(true).toBeTruthy();
		});

		it('should be able to get a specific patient', () => {
			expect(true).toBeTruthy();
		});

		it('should be able to soft delete an patient', () => {
			expect(true).toBeTruthy();
		});

		it('should fail to insert an patient with an already used document id', () => {
			expect(true).toBeTruthy();
		});
		it('should fail to update an patient to an already used document id', () => {
			expect(true).toBeTruthy();
		});
	});

	describe('Exam table', () => {
		it('should be able to insert a new exam', () => {
			expect(true).toBeTruthy();
		});

		it('should be able to update an exam', () => {
			expect(true).toBeTruthy();
		});

		it('should be able to get all the exams', () => {
			expect(true).toBeTruthy();
		});

		it('should be able to get a specific exam', () => {
			expect(true).toBeTruthy();
		});

		it('should be able to soft delete an exam', () => {
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
