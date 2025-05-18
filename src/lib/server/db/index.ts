import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';
import * as schema from './schema';
import { AppInvalidDatabaseURLError } from '../error';

if (!env.DATABASE_URL) throw new AppInvalidDatabaseURLError();
const client = postgres(env.DATABASE_URL);
export const db = drizzle({ client, schema });
