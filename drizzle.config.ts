import { defineConfig } from 'drizzle-kit';
import { AppInvalidDatabaseURLError } from './src/lib/server/error';
if (!process.env.DATABASE_URL) throw new AppInvalidDatabaseURLError();

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',

	dbCredentials: {
		url: process.env.DATABASE_URL
	},

	verbose: true,
	strict: true,
	dialect: 'postgresql'
});
