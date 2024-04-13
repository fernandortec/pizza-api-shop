import type { Restaurant } from "@/database/schemas";
import { DrizzleAuthLinksRepository } from "@/repositories/drizzle/drizzle-auth-links-repository";
import { DrizzleRestaurantsRepository } from "@/repositories/drizzle/drizzle-restaurants-repository";
import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository";
import { createId } from "@paralleldrive/cuid2";

interface CreateAndRetrieveUserResponse {
	code: string;
	managerId: string;
	restaurantId: string | null;
}

export async function createAndRetrieveCode(
	relationship: string | null = null,
): Promise<CreateAndRetrieveUserResponse> {
	const usersRepository = new DrizzleUsersRepository();
	const restaurantsRepository = new DrizzleRestaurantsRepository();
	const authLinksRepository = new DrizzleAuthLinksRepository();

	const manager = await usersRepository.create({
		email: "johndoe@email.com",
		name: "John Doe",
		phone: "000 0000 000",
		role: "manager",
	});

	const code = createId();

	await authLinksRepository.create({ code: code, userId: manager.id });

	if (relationship) {
		const restaurant = await restaurantsRepository.create({
			managerId: manager.id,
			name: "Fake Restaurant",
		});

		return {
			code,
			managerId: manager.id,
			restaurantId: restaurant.id,
		};
	}

	return {
		code,
		managerId: manager.id,
		restaurantId: null,
	};
}
