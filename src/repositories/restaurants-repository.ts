import type { Restaurant } from "@/database/schemas";
import type { CreateRestaurantSchema } from "@/schemas/restaurant-schemas";

export interface RestaurantsRepository {
	create({
		description,
		managerId,
		name,
	}: CreateRestaurantSchema): Promise<Restaurant>;
	findById(id: string): Promise<Restaurant | null>;
	findByManagerId(id: string): Promise<Restaurant | null>;
}
