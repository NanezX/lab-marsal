import { UserRoles, ExamPriority, ExamStatus, PatientGender } from '../../shared/enums';
// import { encodeBase32LowerCase } from '@oslojs/encoding';
import {
	pgEnum,
	pgTable,
	uuid,
	text,
	timestamp,
	boolean,
	jsonb,
	integer,
	decimal,
	varchar
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

// TODO: Check on https://orm.drizzle.team/docs/column-types/pg#jsonb for type inference for jsonb columns on database


// PostgreSQL Enum for User roles
export const userRoleEnum = pgEnum('user_role', [
	UserRoles.Admin,
	UserRoles.Bioanalista,
	UserRoles.Auxiliar,
	UserRoles.Secretaria
]);

// PostgreSQL Enum for Exam priority
export const examPriorityEnum = pgEnum('exam_priority', [
	ExamPriority.Low,
	ExamPriority.Normal,
	ExamPriority.High
]);

// PostgreSQL Enum for Exam status
export const examStatusEnum = pgEnum('exam_status', [
	ExamStatus.Cancelled,
	ExamStatus.Active,
	ExamStatus.Completed
]);

// PostgreSQL Enum for Patient gender
export const patientGenderEnum = pgEnum('patient_gender', [
	PatientGender.Male,
	PatientGender.Female
]);

// TODO: Maybe creating an BaseTable ifno with commons keys like id, createdAt, updatedAt, deleted
const baseTable = {
	// ID of the row
	id: uuid()
		.primaryKey()
		.$defaultFn(() => uuidv4()),
	// Flag for soft delete
	deleted: boolean().notNull().default(false),
	// Time when the row was created
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
		.defaultNow()
		.notNull(),
	// Time of the last update of the table
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
}



// Session table
export const session = pgTable('session', {
	...baseTable,
	userId: uuid('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

// Session relations declarations
export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	})
}));

export const config = pgTable('configuration', {
	id: varchar({ length: 50 }),
	value: text()
});

// User table
export const user = pgTable('user', {
	id: uuid()
		.primaryKey()
		.$defaultFn(() => uuidv4()),
	email: text().notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	firstName: text().notNull(),
	lastName: text().notNull(),
	role: userRoleEnum().notNull(),
	documentId: integer('document_id').notNull().unique(),
	birthdate: timestamp({ withTimezone: true, mode: 'date' }).notNull(),
	deleted: boolean().notNull().default(false),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
});

// User relations declarations
export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session)
}));



// Patient table
export const patient = pgTable('patient', {
	id: uuid()
		.primaryKey()
		.$defaultFn(() => uuidv4()),
	firstName: text().notNull(),
	lastName: text().notNull(),
	documentId: integer('document_id').notNull().unique(),
	birthdate: timestamp({ withTimezone: true, mode: 'date' }).notNull(),
	email: text(),
	phoneNumber: text(),
	gender: patientGenderEnum().notNull(),
	deleted: boolean().notNull().default(false),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
});

// Patient relations declarations
export const patientRelations = relations(user, ({ many }) => ({
	exams: many(exam)
}));

// Exam type table
export const examType = pgTable('exam_type', {
	id: uuid()
		.primaryKey()
		.$defaultFn(() => uuidv4()),
	name: text().notNull().unique(),
	description: text(),
	basePrice: decimal('base_price', { precision: 19, scale: 3 }).notNull(),
	parameters: jsonb().notNull(),
	formulas: jsonb().notNull(),
	deleted: boolean().notNull().default(false),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
});

// Exam type relations declarations
export const examTypeRelations = relations(examType, ({ many }) => ({
	exams: many(exam)
}));

// Exam table
export const exam = pgTable('exam', {
	id: uuid()
		.primaryKey()
		.$defaultFn(() => uuidv4()),
	patientId: uuid('patient_id')
		.notNull()
		.references(() => patient.id),
	examTypeId: uuid('exam_type_id')
		.notNull()
		.references(() => examType.id),
	priority: examPriorityEnum().notNull().default(ExamPriority.Normal),
	status: examStatusEnum().notNull().default(ExamStatus.Active),
	deliveredAt: timestamp('delivered_at', { withTimezone: true, mode: 'date' }),
	results: jsonb(),
	price: decimal('base_price', { precision: 19, scale: 3 }).notNull(),
	paid: boolean().notNull(),
	paymentMethod: text('payment_method'),
	paymentRef: text('payment_ref'),
	deleted: boolean().notNull().default(false),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
});

// Exam relations declarations
export const examRelations = relations(exam, ({ one }) => ({
	patient: one(patient, {
		fields: [exam.patientId],
		references: [patient.id]
	}),
	examType: one(examType, {
		fields: [exam.examTypeId],
		references: [examType.id]
	})
}));
