import { env } from "@/env";
import type { AuthLinksRepository } from "@/repositories/auth-links-repository";
import type { MailsRepository } from "@/repositories/mails-repository";

import type { UsersRepository } from "@/repositories/users-repository";
import type { SendAuthLinkSchema } from "@/schemas/auth-links-schemas";
import { UnauthorizedError } from "@/use-cases/errors/unauthorized-error";
import { createId } from "@paralleldrive/cuid2";

export class SendAuthLinkUseCase {
	constructor(
		private authLinksRepository: AuthLinksRepository,
		private usersRepository: UsersRepository,
		private mailRepository: MailsRepository,
	) {}

	async execute({ email }: SendAuthLinkSchema): Promise<string | false> {
		const doesUserExists = await this.usersRepository.findByEmail(email);
		if (!doesUserExists) throw new UnauthorizedError();

		const authCode = createId();

		await this.authLinksRepository.create({
			code: authCode,
			userId: doesUserExists.id,
		});

		const authLink = new URL("/auth-links/authenticate", env.API_BASE_URL);

		authLink.searchParams.set("code", authCode);
		authLink.searchParams.set("redirect", env.AUTH_REDIRECT_URL);

		const info = await this.mailRepository.sendMail({
			from: { name: "Pizza shop 🍕", address: "hi@pizzashop.com" },
			to: email,
			subject: "Authenticate to Pizza Shop",
			text: `Use the following link to authenticate on Pizza shop: ${authLink.toString()}`,
		});

		return this.mailRepository.getMessage(info);
	}
}
