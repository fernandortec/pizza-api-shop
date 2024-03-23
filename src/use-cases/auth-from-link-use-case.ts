import type { AuthLinksRepository } from "@/repositories/auth-links-repository";
import type { RestaurantsRepository } from "@/repositories/restaurants-repository";

export class AuthFromLinkUseCase {
	constructor(
		private restaurantsRepository: RestaurantsRepository,
		private authLinksRepository: AuthLinksRepository,
	) {}

	async execute({code}) {
    const authLink = await this.authLinksRepository.findByCode(code) 
    if(!authLink) throw new 
  }
}
