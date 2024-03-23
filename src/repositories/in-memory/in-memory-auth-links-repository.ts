import type { AuthLink } from "@/database/schemas";
import type { AuthLinksRepository } from "@/repositories/auth-links-repository";
import type { CreateAuthLinkSchema } from "@/schemas/auth-links-schemas";
import { createId } from "@paralleldrive/cuid2";

export class InMemoryAuthLinksRepository implements AuthLinksRepository {
	private authLinks: AuthLink[] = [];

	async create({
		code,
		userId,
		createdAt,
	}: CreateAuthLinkSchema): Promise<AuthLink> {
		const authLink: AuthLink = {
			id: createId(),
			code: code,
			userId: userId,
			createdAt: createdAt ?? new Date(),
		};

		this.authLinks.push(authLink);

		return authLink;
	}

	async findByCode(code: string): Promise<AuthLink | null> {
		const authLink = this.authLinks.find((authLink) => authLink.code === code);

		if (!authLink) return null;
		return authLink;
	}

	async delete(code: string): Promise<void> {
		this.authLinks.splice(
			this.authLinks.findIndex((authLink) => authLink.code === code),
			1,
		);
	}
}
