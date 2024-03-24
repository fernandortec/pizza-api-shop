import type { Restaurant } from "@/database/schemas";
import type { RestaurantsRepository } from "@/repositories/restaurants-repository";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";

export class GetManagedRestaurantuseCase {
	constructor(private restaurantsRepository: RestaurantsRepository) {}

	async execute(restaurantId: string): Promise<Restaurant> {
		const restaurant = await this.restaurantsRepository.findById(restaurantId);
		if (!restaurant) throw new ResourceNotFoundError();

		return restaurant;
	}
}
