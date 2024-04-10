import type { AuthLinksRepository } from "@/repositories/auth-links-repository";
import type { RestaurantsRepository } from "@/repositories/restaurants-repository";
import type { AuthFromLinkSchema } from "@/schemas/auth-links-schemas";
import { ResourceNotFoundError } from "@/use-cases/_errors/resource-not-found-error";
import dayjs from "dayjs";

interface AuthFromLinkUseCaseResponse {
	userId: string;
	restaurantId?: string;
}
export class AuthFromLinkUseCase {
	constructor(
		private restaurantsRepository: RestaurantsRepository,
		private authLinksRepository: AuthLinksRepository,
	) {}

	async execute({
		code,
	}: AuthFromLinkSchema): Promise<AuthFromLinkUseCaseResponse> {
		const authLink = await this.authLinksRepository.findByCode(code);

		if (!authLink) {
			throw new ResourceNotFoundError();
		}

		const daysSinceAuthLinkWasCreated = dayjs().diff(
			authLink.createdAt,
			"days",
		);

		if (daysSinceAuthLinkWasCreated > 7) {
			throw new Error("Auth link expired, please generate a new one");
		}

		const managedRestaurant = await this.restaurantsRepository.findByManagerId(
			authLink.userId,
		);

		await this.authLinksRepository.delete(code);

		return {
			userId: authLink.userId,
			restaurantId: managedRestaurant?.id,
		};
	}
}
