import { t, type Static } from "elysia";

export const createRestaurantSchema = t.Object({
	name: t.String(),
	managerId: t.String(),
	description: t.Optional(t.String()),
});

export const updateRestaurantSchema = t.Object({
	id: t.String(),
	name: t.Optional(t.String()),
	description: t.Optional(t.String()),
	managerId: t.Optional(t.String()),
	updatedAt: t.Date(),
});

export type UpdateRestaurantSchema = Static<typeof updateRestaurantSchema>;
export type CreateRestaurantSchema = Static<typeof createRestaurantSchema>;
