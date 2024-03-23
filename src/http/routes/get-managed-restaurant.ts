import { db } from "@/database/connection";
import { restaurants } from "@/database/schemas";
import { auth } from "@/http/plugins/auth";
import { eq } from "drizzle-orm";
import { Elysia } from "elysia";

export const getManagedRestaurant = new Elysia()
	.use(auth)
	.get("/managed-restaurant", async ({ getCurrentUser }) => {
		const { restaurantId } = await getCurrentUser();

		if (!restaurantId) {
			throw new Error("User is not a manager");
		}

		const [managedRestaurant] = await db
			.select()
			.from(restaurants)
			.where(eq(restaurants.id, restaurantId));

		return managedRestaurant;
	});
