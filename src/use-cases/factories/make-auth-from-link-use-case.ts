import { DrizzleAuthLinksRepository } from "@/repositories/drizzle/drizzle-auth-links-repository";
import { DrizzleRestaurantsRepository } from "@/repositories/drizzle/drizzle-restaurants-repository";
import { AuthFromLinkUseCase } from "@/use-cases/auth-from-link-use-case";

export function makeAuthFromLinkUseCase() {
	const restaurantsRepository = new DrizzleRestaurantsRepository();
	const authLinksRepository = new DrizzleAuthLinksRepository();

	const authFromLinkUseCase = new AuthFromLinkUseCase(
		restaurantsRepository,
		authLinksRepository,
	);

	return authFromLinkUseCase;
}
