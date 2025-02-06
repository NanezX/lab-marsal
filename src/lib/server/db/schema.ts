import { UserRoles } from '../../shared/enums';
// import { encodeBase32LowerCase } from '@oslojs/encoding';
import { pgEnum, pgTable, uuid, text, timestamp, boolean, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export const userRoleEnum = pgEnum('user_role', [
	UserRoles.admin,
	UserRoles.bioanalista,
	UserRoles.auxiliar,
	UserRoles.secretaria
]);

// User table
export const user = pgTable('user', {
	id: uuid('id')
		.primaryKey()
		.$defaultFn(() => uuidv4()),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	firstName: text('first').notNull(),
	lastName: text('lastname').notNull(),
	role: userRoleEnum().notNull(),
	deleted: boolean().notNull().default(false),
	documentId: text('document_id').notNull(),
	birthdate: date(),
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

// Session table
export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
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

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
