import { type Static, t } from "elysia";

export const statusSchema = t.Union([
	t.Literal("pending"),
	t.Literal("processing"),
	t.Literal("delivering"),
	t.Literal("delivered"),
	t.Literal("canceled"),
]);

export const createOrderSchema = t.Object({
	customerId: t.String(),
	restaurantId: t.String(),
	status: statusSchema,
	totalInCents: t.Number(),
});
export type CreateOrderSchema = Static<typeof createOrderSchema>;

export const updateOrderSchema = t.Object({
	id: t.String(),
	status: t.Optional(statusSchema),
	totalInCents: t.Optional(t.Number()),
});

export type UpdateOrderSchema = Static<typeof updateOrderSchema>;

export const findByCustomerAndRestaurantSchema = t.Object({
	restaurantId: t.String(),
	customerId: t.String(),
});

export type FindByCustomerAndRestaurantSchema = Static<
	typeof findByCustomerAndRestaurantSchema
>;
