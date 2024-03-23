import { DrizzleRestaurantsRepository } from "@/repositories/drizzle/drizzle-restaurants-repository";
import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository";
import { CreateRestaurantManagerUseCase } from "@/use-cases/create-restaurant-manager";

export function makeCreateRestaurantManagerUseCase() {
	const usersRepository = new DrizzleUsersRepository();
	const restaurantsRepository = new DrizzleRestaurantsRepository();

	const createRestaurantManagerUseCase = new CreateRestaurantManagerUseCase(
		usersRepository,
		restaurantsRepository,
	);

	return createRestaurantManagerUseCase;
}
