import { $ } from "bun";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";

import { randomUUID } from "node:crypto";
import postgres from "postgres";

const generateDatabaseUrl = (schema: string): string => {
	if (!process.env.DATABASE_URL) {
		throw new Error("Please provide a DATABASE_URL environment variable.");
	}

	const url = new URL(process.env.DATABASE_URL);
	url.searchParams.set("schema", schema);

	return url.toString();
};

export const setupTestDatabase = async () => {
	const schema = randomUUID();
	const databaseURL = generateDatabaseUrl(schema);

	process.env.DATABASE_URL = databaseURL;

	const connection = postgres(databaseURL);
	const db = drizzle(connection);

	$`bun migrate`;

	await db.execute(sql`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
	await connection.end();
};
