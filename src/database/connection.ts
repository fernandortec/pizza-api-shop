import * as schemas from "@/database/schemas";
import { env } from "@/env";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connection = postgres(env.DATABASE_URL);

export const db = drizzle(connection, { schema: schemas });
