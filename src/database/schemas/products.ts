import type { InferSelectModel } from "drizzle-orm";
import { restaurants } from "@/database/schemas";
import { createId } from "@paralleldrive/cuid2";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
	id: text("id")
		.$defaultFn(() => createId())
		.primaryKey(),
	name: text("name").notNull(),
	description: text("description"),
	priceInCents: integer("price_in_cents").notNull(),
	restaurantId: text("restaurant_id").notNull().references(() => restaurants.id, {
		onDelete: "cascade",
	}),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Product = InferSelectModel<typeof products>;
