import { encodeBase32LowerCase } from '@oslojs/encoding';
import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export enum UserRoles {
	admin = 'administrador',
	bioanalista = 'bioanalista',
	auxiliar = 'auxiliar',
	secretaria = 'secretaria'
}

export const userRoleEnum = pgEnum('user_role', [
	UserRoles.admin,
	UserRoles.bioanalista,
	UserRoles.auxiliar,
	UserRoles.secretaria
]);

export const user = pgTable('user', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => {
			// TODO: Usage of UUID v4 directly?
			// ID with 120 bits of entropy, or about the same as UUID v4.
			const bytes = crypto.getRandomValues(new Uint8Array(15));
			const id = encodeBase32LowerCase(bytes);
			return id;
		}),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	name: text('name').notNull(),
	lastName: text('lastname').notNull(),
	role: userRoleEnum().notNull()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
