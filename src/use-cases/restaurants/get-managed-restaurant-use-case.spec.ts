import { beforeEach, describe, expect, it } from "bun:test";
import { InMemoryRestaurantsRepository } from "@/repositories/in-memory/in-memory-restaurants-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import type { RestaurantsRepository } from "@/repositories/restaurants-repository";
import type { UsersRepository } from "@/repositories/users-repository";
import { ResourceNotFoundError } from "@/use-cases/_errors/resource-not-found-error";
import { GetManagedRestaurantuseCase } from "@/use-cases/restaurants/get-managed-restaurant-use-case";

let restaurantsRepository: RestaurantsRepository;
let usersRepository: UsersRepository;
let sut: GetManagedRestaurantuseCase;

describe("Get managed restaurant use case", () => {
	beforeEach(() => {
		restaurantsRepository = new InMemoryRestaurantsRepository();
		usersRepository = new InMemoryUsersRepository();

		sut = new GetManagedRestaurantuseCase(restaurantsRepository);
	});

	it("should be able to get a managed restaurant", async () => {
		const manager = await usersRepository.create({
			email: "fake@email.com",
			name: "John doe",
			phone: "99 99999 9999",
			role: "manager",
		});

		const restaurant = await restaurantsRepository.create({
			managerId: manager.id,
			name: "Fake restaurant",
			description: "A fake restaurants that sells fake products",
		});

		const restaurantById = await sut.execute(restaurant.id);

		expect(restaurantById?.id).toEqual(expect.any(String));
	});

	it("should throw if restaurant id doesn't belong to an actual restaurant", async () => {
		expect(sut.execute("some-fakeid")).rejects.toBeInstanceOf(
			ResourceNotFoundError,
		);
	});

	it("should throw if restaurantId is not send as a parameter", async () => {
		expect(sut.execute()).rejects.toBeInstanceOf(ResourceNotFoundError);
	});
});
