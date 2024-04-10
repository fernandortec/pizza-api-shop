import { type Static, t } from "elysia";

export const CreateRestaurantAndManagerSchema = t.Object({
	restaurantName: t.String(),
	managerName: t.String(),
	phone: t.String(),
	email: t.String({ format: "email", default: "" }),
});

export type CreateRestaurantAndManagerSchema = Static<
	typeof CreateRestaurantAndManagerSchema
>;
