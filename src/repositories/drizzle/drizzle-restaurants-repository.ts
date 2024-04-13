import { db } from "@/database/connection";
import { type Restaurant, restaurants } from "@/database/schemas";
import type { RestaurantsRepository } from "@/repositories/restaurants-repository";
import type { CreateRestaurantSchema } from "@/schemas/restaurant-schemas";
import { eq } from "drizzle-orm";

export class DrizzleRestaurantsRepository implements RestaurantsRepository {
	async create({
		description,
		managerId,
		name,
	}: CreateRestaurantSchema): Promise<Restaurant> {
		const [restaurant] = await db
			.insert(restaurants)
			.values({ name, description, managerId })
			.returning();

		return restaurant;
	}

	async findById(id: string): Promise<Restaurant | null> {
		const [restaurant] = await db
			.select()
			.from(restaurants)
			.where(eq(restaurants.id, id));

		return restaurant ?? null;
	}

	async findByManagerId(managerId: string): Promise<Restaurant | null> {
		const [restaurant] = await db
			.select()
			.from(restaurants)
			.where(eq(restaurants.managerId, managerId));

		return restaurant ?? null;
	}
}
