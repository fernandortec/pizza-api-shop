import { createId } from "@paralleldrive/cuid2";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from ".";

export const authLinks = pgTable("auth_links", {
	id: text("id")
		.$defaultFn(() => createId())
		.primaryKey(),
	code: text("code").notNull().unique(),
	userId: text("user_id")
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(),
	createdAt: timestamp("created_at").defaultNow(),
});

export type AuthLink = InferSelectModel<typeof authLinks>;
export type CreateAuthLink = InferInsertModel<typeof authLinks>;
