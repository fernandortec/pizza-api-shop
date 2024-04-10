import type { Restaurant } from "@/database/schemas";
import type { RestaurantsRepository } from "@/repositories/restaurants-repository";
import { ResourceNotFoundError } from "@/use-cases/_errors/resource-not-found-error";

export class GetManagedRestaurantuseCase {
	constructor(private restaurantsRepository: RestaurantsRepository) {}

	async execute(restaurantId?: string | null): Promise<Restaurant> {
		if (!restaurantId) throw new ResourceNotFoundError();
		const restaurant = await this.restaurantsRepository.findById(restaurantId);
		if (!restaurant) throw new ResourceNotFoundError();

		return restaurant;
	}
}
