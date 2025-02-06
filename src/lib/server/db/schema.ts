import { UserRoles, ExamPriority, ExamStatus } from '../../shared/enums';
// import { encodeBase32LowerCase } from '@oslojs/encoding';
import {
	pgEnum,
	pgTable,
	uuid,
	text,
	timestamp,
	boolean,
	date,
	jsonb,
	decimal
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

// TODO: Maybe creating an BaseTable ifno with commons keys like id, createdAt, updatedAt, deleted
// TODO: Check on https://orm.drizzle.team/docs/column-types/pg#jsonb for type inference for jsonb columns on database

export const userRoleEnum = pgEnum('user_role', [
	UserRoles.Admin,
	UserRoles.Bioanalista,
	UserRoles.Auxiliar,
	UserRoles.Secretaria
]);

export const examPriorityEnum = pgEnum('exam_priority', [
	ExamPriority.Low,
	ExamPriority.Normal,
	ExamPriority.High
]);

export const examStatusEnum = pgEnum('exam_status', [
	ExamStatus.Cancelled,
	ExamStatus.Active,
	ExamStatus.Completed
]);

// Session table
export const session = pgTable('session', {
	// TODO: Use only UUID as IDs
	id: text().primaryKey(),
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
	documentId: text('document_id').notNull(),
	birthdate: date(),

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
	session: many(session)
}));

// Patient table
export const patient = pgTable('patient', {
	id: uuid()
		.primaryKey()
		.$defaultFn(() => uuidv4())
});

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
	normalValues: jsonb('normal_values').notNull(),

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

// Exam table
export const exam = pgTable('exam', {
	id: uuid()
		.primaryKey()
		.$defaultFn(() => uuidv4()),
	patientId: uuid('patient_id')
		.notNull()
		.references(() => patient.id),
	examType: uuid('exam_type')
		.notNull()
		.references(() => examType.id),
	priority: examPriorityEnum().notNull().default(ExamPriority.Normal),
	status: examStatusEnum().notNull().default(ExamStatus.Active),
	deliveredAt: timestamp('delivered_at', { withTimezone: true, mode: 'date' }),
	results: jsonb(),
	price: decimal('base_price', { precision: 19, scale: 3 }).notNull(),
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
