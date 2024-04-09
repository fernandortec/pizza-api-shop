import { createRestaurantManagerSchema } from "@/schemas/restaurant-manager-schemas";
import { ResourceAlreadyExistsError } from "@/use-cases/errors/resource-already-exists";
import { makeCreateRestaurantManagerUseCase } from "@/use-cases/factories/make-create-restaurant-manager-use-case";
import { Elysia } from "elysia";

export const createRestaurantManager = new Elysia()
	.error({ ALREADY_EXISTS: ResourceAlreadyExistsError })
	.post(
		"/restaurants",
		async ({ body }) => {
			const { email, managerName, phone, restaurantName } = body;

			const createRestaurantManagerUseCase =
				makeCreateRestaurantManagerUseCase();

			const manager = await createRestaurantManagerUseCase.execute({
				email,
				managerName,
				phone,
				restaurantName,
			});

			return manager;
		},
		{
			body: createRestaurantManagerSchema,
			error: ({ code, set }) => {
				switch (code) {
					case "ALREADY_EXISTS":
						set.status = 409;
						return { message: "Manager already exists!" };
				}
			},
		},
	);
