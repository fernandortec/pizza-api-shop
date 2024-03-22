import { DrizzleRestaurantsRepository } from "@/repositories/drizzle/drizzle-restaurants-repository";
import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository";
import { createRestaurantManagerSchema } from "@/schemas/restaurant-manager-schemas";
import { CreateRestaurantManagerUseCase } from "@/use-cases/create-restaurant-manager";
import { EntityAlreadyExistsError } from "@/use-cases/errors/entity-already-exists-error";
import { Elysia } from "elysia";

export const createRestaurantManager = new Elysia()
	.error({ ALREADY_EXISTS: EntityAlreadyExistsError })
	.onError(({ set, code }) => {
		switch (code) {
			case "ALREADY_EXISTS":
				set.status = 409;
				return { message: "Manager already exists!" };
		}
	})
	.post(
		"/account",
		async ({ body }) => {
			const { email, managerName, phone, restaurantName } = body;

			const usersRepository = new DrizzleUsersRepository();
			const restaurantsRepository = new DrizzleRestaurantsRepository();

			const createRestaurantManagerUseCase = new CreateRestaurantManagerUseCase(
				usersRepository,
				restaurantsRepository,
			);

			const manager = await createRestaurantManagerUseCase.execute({
				email,
				managerName,
				phone,
				restaurantName,
			});

			return manager;
		},
		{ body: createRestaurantManagerSchema },
	);
