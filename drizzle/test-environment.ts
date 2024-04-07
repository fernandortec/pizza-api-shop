import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";

import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import postgres from "postgres";

import { afterAll, beforeAll } from "bun:test";

if (process.env.IS_TEST_E2E) {
	if (!process.env.DATABASE_URL) {
		throw new Error("Please provide a DATABASE_URL environment variable.");
	}

	const schema = randomUUID();

	beforeAll(async () => {
		const connection = postgres(String(process.env.DATABASE_URL), {});
		const db = drizzle(connection);

		await db.execute(sql.raw(`CREATE SCHEMA IF NOT EXISTS "${schema}";`));

		const databaseURL = new URL(String(process.env.DATABASE_URL));
		databaseURL.searchParams.set("search_path", schema);

		process.env.DATABASE_URL = databaseURL.toString()

		execSync("bun drizzle-kit push:pg");
	});

	afterAll(() => {
		// global teardown
	});
	// if (!process.env.DATABASE_URL) {
	// 	throw new Error("Please provide a DATABASE_URL environment variable.");
	// }

	// const schema = randomUUID();

	// const connection = postgres(process.env.DATABASE_URL, {});
	// const db = drizzle(connection);

	// await db.execute(sql`CREATE SCHEMA IF NOT EXISTS ${schema};`);

	// process.env.DATABASE_URL = databaseURL.toString();

	// console.log(databaseURL);

	// await db.execute(sql`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
	// await connection.end();
}
