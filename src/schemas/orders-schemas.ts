import { type Static, t } from "elysia";

export const createOrderSchema = t.Object({
	customerId: t.String(),
	restaurantId: t.String(),
	status: t.Union([
		t.Literal("pending"),
		t.Literal("processing"),
		t.Literal("delivering"),
		t.Literal("delivered"),
		t.Literal("canceled"),
	]),
	totalInCents: t.Number(),
});

export type CreateOrderSchema = Static<typeof createOrderSchema>;

export const findByCustomerAndRestaurantSchema = t.Object({
	restaurantId: t.String(),
	customerId: t.String(),
});

export type FindByCustomerAndRestaurantSchema = Static<
	typeof findByCustomerAndRestaurantSchema
>;
