import type { AuthLink } from "@/database/schemas";
import type { CreateAuthLinkSchema } from "@/schemas/auth-links-schemas";

export interface AuthLinksRepository {
	create({ code, userId }: CreateAuthLinkSchema): Promise<AuthLink>;
	findByCode(code: string): Promise<AuthLink | null>;
	delete(id: string): Promise<void>;
}
