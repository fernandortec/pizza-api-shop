import { type User } from "@/database/schemas";
import type { RestaurantsRepository } from "@/repositories/restaurants-repository";
import type { UsersRepository } from "@/repositories/users-repository";
import type { CreateRestaurantAndManagerSchema } from "@/schemas/restaurant-manager-schemas";
import { ResourceAlreadyExistsError } from "@/use-cases/_errors/resource-already-exists";

export class CreateRestaurantAndManagerUseCase {
	constructor(
		private usersRepository: UsersRepository,
		private restaurantsRepository: RestaurantsRepository,
	) {}

	async execute({
		email,
		managerName,
		phone,
		restaurantName,
	}: CreateRestaurantAndManagerSchema): Promise<User> {
		const doesManagerExists = await this.usersRepository.findByEmail(email);
		if (doesManagerExists) throw new ResourceAlreadyExistsError();

		const manager = await this.usersRepository.create({
			email,
			name: managerName,
			phone,
			role: "manager",
		});

		await this.restaurantsRepository.create({
			name: restaurantName,
			managerId: manager.id,
		});

		return manager;
	}
}
