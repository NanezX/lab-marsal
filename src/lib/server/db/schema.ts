import { encodeBase32LowerCase } from '@oslojs/encoding';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

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
	username: text('username').notNull().unique(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	fullname: text('fullname').notNull()
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
