import { randomUUID } from "node:crypto";

import { afterEach, beforeEach } from "bun:test";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

async function updateDatabaseURLWithSchema(): Promise<void> {
	if (!process.env.IS_E2E) return;
	if (!process.env.DATABASE_URL)
		throw new Error("Please provide a DATABASE_URL envirnoment variable");

	const schema = randomUUID();
	const databaseURL = new URL(String(process.env.DATABASE_URL));
	databaseURL.searchParams.set("search_path", schema);

	process.env.DATABASE_URL = databaseURL.toString();

	const connection = postgres(String(process.env.DATABASE_URL), {
		max: 1,
		max_lifetime: 10,
	});

	const db = drizzle(connection);

	beforeEach(async () => {
		await migrate(db, {
			migrationsFolder: "drizzle",
			migrationsSchema: schema,
		});
	});

	afterEach(async () => {
		await db.execute(sql.raw(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`));
	});
}

await updateDatabaseURLWithSchema();
