import { DrizzleRestaurantsRepository } from "@/repositories/drizzle/drizzle-restaurants-repository";
import { GetManagedRestaurantuseCase } from "@/use-cases/restaurants/get-managed-restaurant-use-case";

export function makeGetManagedRestaurantUseCase() {
	const restaurantsRepository = new DrizzleRestaurantsRepository();
	const getManagedRestaurantUseCase = new GetManagedRestaurantuseCase(
		restaurantsRepository,
	);

	return getManagedRestaurantUseCase;
}
