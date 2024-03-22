import type { Restaurant } from "@/database/schemas";
import type { RestaurantsRepository } from "@/repositories/restaurants-repository";
import type { CreateRestaurantSchema } from "@/schemas/restaurant-schemas";
import { createId } from "@paralleldrive/cuid2";

export class InMemoryrestaurantsRepository implements RestaurantsRepository {
	private restaurants: Restaurant[] = [];

	async create({
		managerId,
		name,
		description,
	}: CreateRestaurantSchema): Promise<Restaurant> {
		const restaurant: Restaurant = {
			id: createId(),
			name,
			managerId,
			description: description ?? null,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		this.restaurants.push(restaurant);

		return restaurant;
	}

	async findById(id: string): Promise<Restaurant | null> {
		const restaurant = this.restaurants.find(
			(restaurant) => restaurant.id === id,
		);

		if (!restaurant) return null;
		return restaurant;
	}

	async findByManagerId(managerId: string): Promise<Restaurant | null> {
		const restaurant = this.restaurants.find(
			(restaurant) => restaurant.managerId === managerId,
		);

		if (!restaurant) return null;
		return restaurant;
	}
}
