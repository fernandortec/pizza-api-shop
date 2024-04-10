import { CreateRestaurantAndManagerSchema } from "@/schemas/restaurant-manager-schemas";
import { ResourceAlreadyExistsError } from "@/use-cases/_errors/resource-already-exists";
import { makeCreateRestaurantAndManagerUseCase } from "@/use-cases/_factories/make-create-restaurant-manager-use-case";
import { Elysia } from "elysia";

export const CreateRestaurantAndManager = new Elysia()
	.error({ ALREADY_EXISTS: ResourceAlreadyExistsError })
	.post(
		"/restaurants",
		async ({ body }) => {
			const { email, managerName, phone, restaurantName } = body;

			const CreateRestaurantAndManagerUseCase =
				makeCreateRestaurantAndManagerUseCase();

			const manager = await CreateRestaurantAndManagerUseCase.execute({
				email,
				managerName,
				phone,
				restaurantName,
			});

			return manager;
		},
		{
			body: CreateRestaurantAndManagerSchema,
			error: ({ code, set }) => {
				switch (code) {
					case "ALREADY_EXISTS":
						set.status = 409;
						return { message: "Manager already exists!" };
				}
			},
		},
	);
