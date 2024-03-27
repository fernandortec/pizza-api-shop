import { orders, restaurants } from "@/database/schemas";
import { createId } from "@paralleldrive/cuid2";
import { type InferSelectModel, relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const userRolesEnum = pgEnum("user_role", ["manager", "customer"]);

export const users = pgTable("users", {
	id: text("id")
		.$defaultFn(() => createId())
		.primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	phone: text("phone"),
	role: userRolesEnum("role").default("customer").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const usersRelation = relations(users, ({ one, many }) => {
	return {
		managedRestaurant: one(restaurants, {
			fields: [users.id],
			references: [restaurants.managerId],
			relationName: "managed_restaurant",
		}),
		orders: many(orders),
	};
});

export type User = InferSelectModel<typeof users>;
