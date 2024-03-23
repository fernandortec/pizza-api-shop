import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/env";
import * as schemas from "@/database/schemas";

const connection = postgres(env.DATABASE_URL);

export const db = drizzle(connection, { schema: schemas });
