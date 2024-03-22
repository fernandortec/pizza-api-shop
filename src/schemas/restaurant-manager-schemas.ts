import { type Static, t } from "elysia";

export const createRestaurantManagerSchema = t.Object({
	restaurantName: t.String(),
	managerName: t.String(),
	phone: t.String(),
	email: t.String({ format: "email", default: "" }),
});

export type CreateRestaurantManagerSchema = Static<
	typeof createRestaurantManagerSchema
>;
