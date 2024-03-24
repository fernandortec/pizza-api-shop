import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository";
import { GetProfileUseCase } from "@/use-cases/get-profile-use-case";

export function makeGetProfileUseCase() {
	const usersRepository = new DrizzleUsersRepository();
	const getProfileUseCase = new GetProfileUseCase(usersRepository);

	return getProfileUseCase;
}
