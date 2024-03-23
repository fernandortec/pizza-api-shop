import { InMemoryrestaurantsRepository } from "@/repositories/in-memory/in-memory-restaurants-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import type { RestaurantsRepository } from "@/repositories/restaurants-repository";
import type { UsersRepository } from "@/repositories/users-repository";
import { CreateRestaurantManagerUseCase } from "@/use-cases/create-restaurant-manager";
import { ResourceAlreadyExistsError } from "@/use-cases/errors/resource-already-exists";
import { beforeEach, describe, expect, it } from "bun:test";

let usersRepository: UsersRepository;
let restaurantsRepository: RestaurantsRepository;
let sut: CreateRestaurantManagerUseCase;

describe("Create restaurant manager use case", () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		restaurantsRepository = new InMemoryrestaurantsRepository();

		sut = new CreateRestaurantManagerUseCase(
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

	//TODO- add tests to link iff recently created manager and restaurant are linked

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
