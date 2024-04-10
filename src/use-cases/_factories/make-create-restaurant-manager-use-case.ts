import { DrizzleRestaurantsRepository } from "@/repositories/drizzle/drizzle-restaurants-repository";
import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository";
import { CreateRestaurantAndManagerUseCase } from "@/use-cases/restaurants/create-restaurant-and-manager";

export function makeCreateRestaurantAndManagerUseCase() {
	const usersRepository = new DrizzleUsersRepository();
	const restaurantsRepository = new DrizzleRestaurantsRepository();

	const CreateRestaurantAndManagerUseCase =
		new CreateRestaurantAndManagerUseCase(
			usersRepository,
			restaurantsRepository,
		);

	return CreateRestaurantAndManagerUseCase;
}
