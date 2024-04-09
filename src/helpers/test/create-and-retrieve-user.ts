import { DrizzleRestaurantsRepository } from "@/repositories/drizzle/drizzle-restaurants-repository";
import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository";

interface CreateAndRetrieveUserResponse {
	userId: string;
	restaurantId?: string;
}

export async function createAndRetrieveUser(): Promise<CreateAndRetrieveUserResponse> {
	const usersRepository = new DrizzleUsersRepository();
	const restaurantsRepository = new DrizzleRestaurantsRepository();

	const manager = await usersRepository.create({
		email: "johndoe@email.com",
		name: "John Doe",
		phone: "000 0000 000",
		role: "manager",
	});

	const restaurant = await restaurantsRepository.create({
		managerId: manager.id,
		name: "Fake Restaurant",
		description: "A restaurant that serves nothing",
	});

	return { userId: manager.id, restaurantId: restaurant.id };
}
