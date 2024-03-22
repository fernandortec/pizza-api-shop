import { db } from "@/database/connection";
import { type AuthLink, authLinks } from "@/database/schemas";
import type { AuthLinksRepository } from "@/repositories/auth-links-repository";
import type { CreateAuthLinkSchema } from "@/schemas/auth-links-schemas";
import { eq } from "drizzle-orm";

export class DrizzleAuthLinksRepository implements AuthLinksRepository {
	async create({ code, userId }: CreateAuthLinkSchema): Promise<AuthLink> {
		const [authLink] = await db.insert(authLinks).values({ code, userId });
		return authLink;
	}

	async findByCode(code: string): Promise<AuthLink | null> {
		const [authLink] = await db
			.select()
			.from(authLinks)
			.where(eq(authLinks.code, code));

		return authLink ?? null;
	}

	async delete(id: string): Promise<void> {
		await db.delete(authLinks).where(eq(authLinks.id, id));
	}
}
