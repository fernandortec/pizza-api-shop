import type { User } from "@/database/schemas";
import type { UsersRepository } from "@/repositories/users-repository";
import { ResourceNotFoundError } from "@/use-cases/_errors/resource-not-found-error";

export class GetProfileUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute(userId?: string | null): Promise<User | null> {
		if (!userId) throw new ResourceNotFoundError();

		const user = await this.usersRepository.findById(userId);
		if (!user) throw new ResourceNotFoundError();

		return user;
	}
}
