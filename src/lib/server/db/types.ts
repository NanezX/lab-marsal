import type { session, user } from './schema';

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
