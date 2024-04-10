import { beforeEach, describe, expect, it } from "bun:test";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import type { UsersRepository } from "@/repositories/users-repository";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { GetProfileUseCase } from "@/use-cases/users/get-profile-use-case";

let usersRepository: UsersRepository;
let sut: GetProfileUseCase;

describe("Get profile use case", () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new GetProfileUseCase(usersRepository);
	});

	it("should be able to get a profile", async () => {
		const user = await usersRepository.create({
			email: "fake@email.com",
			name: "John doe",
			phone: "99 99999 9999",
			role: "customer",
		});

		const userById = await sut.execute(user.id);

		expect(userById?.id).toEqual(expect.any(String));
	});

	it("should throw if userId doesn't belong to an actual user", async () => {
		expect(sut.execute("some-fake-id")).rejects.toBeInstanceOf(
			ResourceNotFoundError,
		);
	});

	it("should throw if userId is not send as a parameter", async () => {
		expect(sut.execute()).rejects.toBeInstanceOf(ResourceNotFoundError);
	});
});
