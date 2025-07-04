import {
	UserRoles,
	ExamPriority,
	ExamStatus,
	PatientGender,
	PaymentMethod
} from '../../shared/enums';
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
	varchar,
	uniqueIndex,
	type AnyPgColumn
} from 'drizzle-orm/pg-core';
import { relations, type SQL, sql } from 'drizzle-orm';
import { generateRandomUUID } from './uuid';

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
	ExamStatus.Pending,
	ExamStatus.Ready,
	ExamStatus.Completed
]);

// PostgreSQL Enum for Exam Payment Method
export const examPaymentMethodEnum = pgEnum('payment_menthod', [
	PaymentMethod.PuntoDeVenta,
	PaymentMethod.PagoMovil,
	PaymentMethod.EfectivoBolivares,
	PaymentMethod.EfectivoDolares,
	PaymentMethod.Otro
]);

// PostgreSQL Enum for Patient gender
export const patientGenderEnum = pgEnum('patient_gender', [
	PatientGender.Male,
	PatientGender.Female
]);

export function lower(email: AnyPgColumn): SQL {
	return sql`lower(${email})`;
}

const baseTable = {
	// ID of the row
	id: uuid()
		.primaryKey()
		.$defaultFn(() => generateRandomUUID()),
	// Flag for soft delete
	deleted: boolean().notNull().default(false),
	// Time when the row was created
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	// Time of the last update of the table
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
};

// Session table
export const session = pgTable('session', {
	id: baseTable.id,
	createdAt: baseTable.createdAt,
	updatedAt: baseTable.updatedAt,
	sessionToken: text('session_token').notNull(),
	sessionId: text('session_id').notNull().unique(),
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

// UserRecovery table
export const userRecovery = pgTable('user_recovery', {
	id: baseTable.id,
	userId: uuid('user_id')
		.notNull()
		.references(() => user.id),
	code: text().notNull(),
	sessionId: text('session_id').notNull().unique(),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

// User Recovery relations declarations
export const userRecoveryRelations = relations(userRecovery, ({ one }) => ({
	user: one(user, {
		fields: [userRecovery.userId],
		references: [user.id]
	})
}));

// Configuration table
export const config = pgTable('configuration', {
	id: varchar({ length: 50 }),
	value: text()
});

// User table
export const user = pgTable(
	'user',
	{
		...baseTable,
		email: text().notNull().unique(),
		passwordHash: text('password_hash').notNull(),
		firstName: text().notNull(),
		lastName: text().notNull(),
		firstNameNormalized: text().notNull(),
		lastNameNormalized: text().notNull(),
		role: userRoleEnum().notNull(),
		documentId: integer('document_id').notNull().unique(),
		birthdate: timestamp({ withTimezone: true, mode: 'date' }).notNull()
	},
	(table) => [uniqueIndex('emailUniqueIndex').on(lower(table.email))]
);

// User relations declarations
export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session)
}));

// Patient table
export const patient = pgTable('patient', {
	...baseTable,
	firstName: text().notNull(),
	lastName: text().notNull(),
	firstNameNormalized: text().notNull(),
	lastNameNormalized: text().notNull(),
	documentId: integer('document_id').unique(),
	birthdate: timestamp({ withTimezone: true, mode: 'date' }).notNull(),
	email: text(),
	phoneNumber: text(),
	gender: patientGenderEnum().notNull()
});

// Patient relations declarations
export const patientRelations = relations(patient, ({ many }) => ({
	exams: many(exam)
}));

// Parameter table
export const parameter = pgTable('parameter', {
	...baseTable,
	position: integer().notNull(),
	name: text().notNull(),
	type: text().notNull(),
	category: text(),
	unit: text(),
	hasReferences: boolean('has_references').notNull(),
	referenceValues: text('reference_values')
		.array()
		.notNull()
		.default(sql`ARRAY[]::text[]`),
	examTypeId: uuid('exam_type_id')
		.notNull()
		.references(() => examType.id)
});

// Parameter relations declarations
export const parameterRelations = relations(parameter, ({ one }) => ({
	examType: one(examType, {
		fields: [parameter.examTypeId],
		references: [examType.id]
	})
}));

// Exam type Classification table
export const examTypeClassification = pgTable('exam_type_classification', {
	...baseTable,
	name: text().notNull().unique(),
	nameNormalized: text().notNull().unique()
});

export const examTypeClassificationRelations = relations(examTypeClassification, ({ many }) => ({
	examTypes: many(examType)
}));

// Exam type table
export const examType = pgTable(
	'exam_type',
	{
		...baseTable,
		name: text().notNull().unique(),
		nameNormalized: text().notNull().unique(),
		description: text(),
		basePrice: decimal('base_price', { precision: 19, scale: 2 }).notNull(),
		categories: text()
			.array()
			.notNull()
			.default(sql`ARRAY[]::text[]`),

		classificationId: uuid('classification_id')
			.notNull()
			.references(() => examTypeClassification.id)
	},
	(table) => [uniqueIndex('nameUniqueIndex').on(lower(table.name))]
);

// Exam type relations declarations
export const examTypeRelations = relations(examType, ({ one, many }) => ({
	exams: many(exam),
	parameters: many(parameter),
	classification: one(examTypeClassification, {
		fields: [examType.classificationId],
		references: [examTypeClassification.id]
	})
}));

export const examResult = pgTable('exam_result', {
	...baseTable,
	examId: uuid('exam_id')
		.notNull()
		.references(() => exam.id, { onDelete: 'cascade' }),
	parameterId: uuid('parameter_id')
		.notNull()
		.references(() => parameter.id),
	value: text().notNull(),
	// Snapshot to preserve parameter info at the time of result entry
	parameterSnapshot: jsonb('parameter_snapshot').notNull().$type<{
		position: number;
		name: string;
		type: string;
		category?: string;
		unit?: string;
		hasReferences: boolean;
		referenceValues: string[];
	}>()
});

export const examResultRelations = relations(examResult, ({ one }) => ({
	exam: one(exam, {
		fields: [examResult.examId],
		references: [exam.id]
	}),
	parameter: one(parameter, {
		fields: [examResult.parameterId],
		references: [parameter.id]
	})
}));

// Exam table
export const exam = pgTable('exam', {
	...baseTable,
	patientId: uuid('patient_id')
		.notNull()
		.references(() => patient.id),
	examTypeId: uuid('exam_type_id')
		.notNull()
		.references(() => examType.id),

	// Exam details
	customTag: text('custom_tag').notNull(),
	priority: examPriorityEnum().notNull().default(ExamPriority.Normal),
	status: examStatusEnum().notNull().default(ExamStatus.Pending),
	deliveredAt: timestamp('delivered_at', { withTimezone: true, mode: 'date' }), // Set when the exam is deliveted

	// Payment details
	paid: boolean().notNull(), // When the exam is paid
	pricePaid: decimal('price_paid', { precision: 19, scale: 2 }), // Amount paid (probably after marked paid)
	// paymentMethod: text('payment_method'), // payment method defined by administration
	paymentMethod: examPaymentMethodEnum(), // payment method defined by administration
	paymentRef: text('payment_ref'), // Reference if apply
	paidAt: timestamp('paid_at', { withTimezone: true, mode: 'date' }), // Set when the exam is paid

	//////////////////////
	//////////////////////
	// Results details
	sample: text(),
	observation: text() // Optional observation by the lab
	// results: jsonb(), // (Other table) - Added when uploading the results
});

// Exam relations declarations
export const examRelations = relations(exam, ({ one, many }) => ({
	patient: one(patient, {
		fields: [exam.patientId],
		references: [patient.id]
	}),
	examType: one(examType, {
		fields: [exam.examTypeId],
		references: [examType.id]
	}),
	results: many(examResult)
}));
