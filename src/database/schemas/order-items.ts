import { products } from "@/database/schemas";
import { orders } from "@/database/schemas/orders";
import { createId } from "@paralleldrive/cuid2";
import type { InferSelectModel } from "drizzle-orm";
import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const orderItems = pgTable("order_items", {
	id: text("id")
		.$defaultFn(() => createId())
		.primaryKey(),
	orderId: text("order_id")
		.notNull()
		.references(() => orders.id, {
			onDelete: "cascade",
		}),
	productId: text("product_id").references(() => products.id, {
		onDelete: "set null",
	}),
	priceInCents: integer("price_in_cents").notNull(),
	quantity: integer("quantity").notNull(),
});

export type OrderItems = InferSelectModel<typeof orderItems>;
