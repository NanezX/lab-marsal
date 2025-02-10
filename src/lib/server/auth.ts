import type { RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import {
	encodeBase32UpperCaseNoPadding,
	encodeBase64url,
	encodeHexLowerCase
} from '@oslojs/encoding';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const HOUR_IN_MS = 1000 * 60 * 60;

export const sessionCookieName = 'auth-session';
export const recoverySessionCookieName = 'recovery-session';

export function generateRandomOTP(): string {
	const bytes = new Uint8Array(3);
	crypto.getRandomValues(bytes);
	const code = encodeBase32UpperCaseNoPadding(bytes);
	return code;
}

export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(32));
	return encodeBase64url(bytes);
}

export function hashSessionToken(sessionToken: string) {
	return encodeHexLowerCase(sha256(new TextEncoder().encode(sessionToken)));
}

export async function createSession(sessionToken: string, userId: string) {
	// Hash the session token
	const sessionId = hashSessionToken(sessionToken);

	// Object with the data
	const session = {
		sessionToken,
		expiresAt: new Date(Date.now() + DAY_IN_MS * 30)
	};

	// Insert the session
	await db.insert(table.session).values({
		...session,
		sessionId,
		userId
	});

	return session;
}

export async function validateSessionToken(sessionToken: string) {
	// Hash the token
	const sessionId = hashSessionToken(sessionToken);

	// Query to the database
	const [result] = await db
		.select({
			user: {
				id: table.user.id,
				deleted: table.user.deleted,
				createdAt: table.user.createdAt,
				updatedAt: table.user.updatedAt,
				email: table.user.email,
				firstName: table.user.firstName,
				lastName: table.user.lastName,
				role: table.user.role,
				documentId: table.user.documentId,
				birthdate: table.user.birthdate
			},
			session: {
				id: table.session.id,
				userId: table.session.userId,
				expiresAt: table.session.expiresAt
			}
		})
		.from(table.session)
		.innerJoin(table.user, eq(table.session.userId, table.user.id))
		.where(eq(table.session.sessionId, sessionId));

	// If no result or user deleted, invalid session
	if (!result || result.user.deleted) {
		return { session: null, user: null };
	}

	// Deconstruct the result
	const { session, user } = result;

	// Check if the session has expired
	const sessionExpired = Date.now() >= session.expiresAt.getTime();
	if (sessionExpired) {
		await db.delete(table.session).where(eq(table.session.id, session.id));
		return { session: null, user: null };
	}

	// Renew the session (maybe not necessary)
	const renewSession = Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15;
	if (renewSession) {
		session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
		await db
			.update(table.session)
			.set({ expiresAt: session.expiresAt })
			.where(eq(table.session.id, session.id));
	}

	// Return the session and user
	return { session, user };
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(sessionToken: string) {
	// Hash the token
	const sessionId = hashSessionToken(sessionToken);

	await db.delete(table.session).where(eq(table.session.sessionId, sessionId));
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
	event.cookies.set(sessionCookieName, token, {
		expires: expiresAt,
		path: '/',
		// sameSite: 'lax',
		secure: false,
		httpOnly: true
	});
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.delete(sessionCookieName, {
		path: '/',
		// sameSite: 'lax',
		secure: false,
		httpOnly: true
	});
}

export const hashingOptions = {
	variant: 'argon2id',
	memoryCost: 19456,
	timeCost: 2,
	outputLen: 32,
	parallelism: 1
};

// RECOVERY AUTH UTILS
export function setRecoverySessionCookie(event: RequestEvent, token: string, expiresAt: Date) {
	event.cookies.set(recoverySessionCookieName, token, {
		expires: expiresAt,
		path: '/',
		// sameSite: 'lax',
		secure: false,
		httpOnly: true
	});
}

export function deleteRecoverySessionCookie(event: RequestEvent) {
	event.cookies.delete(recoverySessionCookieName, {
		path: '/',
		// sameSite: 'lax',
		secure: false,
		httpOnly: true
	});
}

export async function invalidateRecoveryPasswordSession(userId: string) {
	// Delete the user recovery session
	await db.delete(table.userRecovery).where(eq(table.userRecovery.userId, userId));
}

export async function createRecoveryPasswordSession(
	sessionToken: string,
	userId: string,
	userEmail: string
) {
	// Hash the recovery session token
	const sessionId = hashSessionToken(sessionToken);

	// Object with the data
	const session = {
		sessionToken,
		email: userEmail,
		code: generateRandomOTP(),
		expiresAt: new Date(Date.now() + HOUR_IN_MS) // 1 hour,
	};

	// Insert the recovery session
	await db.insert(table.userRecovery).values({
		...session,
		sessionId,
		userId
	});

	return session;
}

export async function validateRecoveryPasswordSession(sessionToken: string) {
	// Hash the token
	const sessionId = hashSessionToken(sessionToken);

	// Query to the database
	const [result] = await db
		.select({
			recoverySession: {
				id: table.userRecovery.id,
				code: table.userRecovery.code,
				expiresAt: table.userRecovery.expiresAt
			},
			user: {
				id: table.user.id,
				email: table.user.email
			}
		})
		.from(table.userRecovery)
		.innerJoin(table.user, eq(table.userRecovery.userId, table.user.id))
		.where(eq(table.userRecovery.sessionId, sessionId));

	// If no result, invalid recovery session
	if (!result) {
		return null;
	}

	// Deconstruct the result
	const { recoverySession, user } = result;

	// Check if the recovery session has expired
	const sessionExpired = Date.now() >= recoverySession.expiresAt.getTime();
	if (sessionExpired) {
		invalidateRecoveryPasswordSession(user.id);
		return null;
	}

	return { recoverySession, user };
}
