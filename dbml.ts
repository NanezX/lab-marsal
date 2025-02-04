import * as schema from './src/lib/server/db/schema';
import { pgGenerate } from 'drizzle-dbml-generator'; // Using Postgres for this example

const out = './schema2.dbml';
const relational = true;

pgGenerate({ schema, out, relational });