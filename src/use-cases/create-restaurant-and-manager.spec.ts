import { beforeEach, describe, expect, it } from "bun:test";
import { InMemoryRestaurantsRepository } from "@/repositories/in-memory/in-memory-restaurants-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import type { RestaurantsRepository } from "@/repositories/restaurants-repository";
import type { UsersRepository } from "@/repositories/users-repository";
import { CreateRestaurantAndManagerUseCase } from "@/use-cases/create-restaurant-and-manager";
import { ResourceAlreadyExistsError } from "@/use-cases/errors/resource-already-exists";

let usersRepository: UsersRepository;
let restaurantsRepository: RestaurantsRepository;
let sut: CreateRestaurantAndManagerUseCase;

describe("Create restaurant manager use case", () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		restaurantsRepository = new InMemoryRestaurantsRepository();

		sut = new CreateRestaurantAndManagerUseCase(
			usersRepository,
			restaurantsRepository,
		);
	});

	it("should be able to create a restaurant and a manager", async () => {
		const manager = await sut.execute({
			email: "test@email.com",
			phone: "+99 (99) 99999 9999",
			managerName: "Manager of restaurant",
			restaurantName: "Restaurant test",
		});

		expect(manager.id).toEqual(expect.any(String));
	});

	it("should not be able to registe with same email twice", async () => {
		await sut.execute({
			email: "test@email.com",
			phone: "+99 (99) 99999 9999",
			managerName: "Manager of restaurant",
			restaurantName: "Restaurant test",
		});

		expect(
			sut.execute({
				email: "test@email.com",
				phone: "+99 (99) 99999 9999",
				managerName: "Manager of restaurant",
				restaurantName: "Restaurant test",
			}),
		).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
	});
});
