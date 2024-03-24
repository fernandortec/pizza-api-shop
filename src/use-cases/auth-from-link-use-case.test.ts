import { beforeEach, describe, expect, it } from "bun:test";

import { randomUUID } from "node:crypto";
import type { AuthLinksRepository } from "@/repositories/auth-links-repository";
import { InMemoryAuthLinksRepository } from "@/repositories/in-memory/in-memory-auth-links-repository";
import { InMemoryRestaurantsRepository } from "@/repositories/in-memory/in-memory-restaurants-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import type { RestaurantsRepository } from "@/repositories/restaurants-repository";
import type { UsersRepository } from "@/repositories/users-repository";
import { AuthFromLinkUseCase } from "@/use-cases/auth-from-link-use-case";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";

let restaurantsRepository: RestaurantsRepository;
let authLinksRepository: AuthLinksRepository;
let usersRepository: UsersRepository;
let sut: AuthFromLinkUseCase;

describe("Auth from link use case", () => {
	beforeEach(() => {
		restaurantsRepository = new InMemoryRestaurantsRepository();
		authLinksRepository = new InMemoryAuthLinksRepository();
		usersRepository = new InMemoryUsersRepository();

		sut = new AuthFromLinkUseCase(restaurantsRepository, authLinksRepository);
	});

	it("should be able to auth from link", async () => {
		const user = await usersRepository.create({
			email: "john@doe.com",
			name: "John doe",
			phone: "99 99999 9999",
			role: "manager",
		});

		const authLink = await authLinksRepository.create({
			code: randomUUID(),
			userId: user.id,
		});

		const restaurant = await restaurantsRepository.create({
			managerId: user.id,
			name: "Fake restaurant",
			description: "Restaurant that sells fake food",
		});

		const authData = await sut.execute({
			code: authLink.code,
			redirect: "https://fakeurl.com",
		});

		expect(authData.userId).toEqual(user.id);
		expect(authData.restaurantId).toEqual(restaurant.id);
	});

	it("should throw if auth link does not exists", async () => {
		expect(
			sut.execute({
				code: "some-fake-code",
				redirect: "https://fake-url.com",
			}),
		).rejects.toBeInstanceOf(ResourceNotFoundError);
	});

	it("should throw if auth link is too old", async () => {
		const user = await usersRepository.create({
			email: "john@doe.com",
			name: "John doe",
			phone: "99 99999 9999",
			role: "manager",
		});

		const authLink = await authLinksRepository.create({
			code: randomUUID(),
			userId: user.id,
		});

		const dateEightDaysInThePast = new Date();
		dateEightDaysInThePast.setDate(new Date().getDate() - 8);

		const invalidAuthLink = await authLinksRepository.create({
			code: randomUUID(),
			userId: user.id,
			createdAt: dateEightDaysInThePast,
		});

		expect(
			sut.execute({
				code: invalidAuthLink.code,
				redirect: "https://fake-url.com",
			}),
		).rejects.toBeInstanceOf(Error);

		expect(authLink.id).toEqual(expect.any(String));
	});

	it("should return no restaurantId if user is not a manager", async () => {
		const user = await usersRepository.create({
			email: "john@doe.com",
			name: "John doe",
			phone: "99 99999 9999",
			role: "manager",
		});

		const authLink = await authLinksRepository.create({
			code: randomUUID(),
			userId: user.id,
		});

		const authData = await sut.execute({
			code: authLink.code,
			redirect: "https://fake-url.com",
		});

		expect(authData.restaurantId).toBeUndefined();
	});
});
