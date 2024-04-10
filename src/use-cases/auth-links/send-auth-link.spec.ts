import { beforeEach, describe, expect, it } from "bun:test";

import type { AuthLinksRepository } from "@/repositories/auth-links-repository";
import { InMemoryAuthLinksRepository } from "@/repositories/in-memory/in-memory-auth-links-repository";
import { InMemorySmtpMailProvider } from "@/repositories/in-memory/in-memory-smtp-mail-provider";
import { InMemorySmtpMailRepository } from "@/repositories/in-memory/in-memory-smtp-mails-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import type {
	MailProvider,
	MailsRepository,
} from "@/repositories/mails-repository";
import type { UsersRepository } from "@/repositories/users-repository";
import { SendAuthLinkUseCase } from "@/use-cases/auth-links/send-auth-link";
import { UnauthorizedError } from "@/use-cases/errors/unauthorized-error";

describe("Send auth link use case", () => {
	let usersRepository: UsersRepository;
	let mailsRepository: MailsRepository;
	let authLinksRepository: AuthLinksRepository;
	let mailProvider: MailProvider;

	let sut: SendAuthLinkUseCase;

	beforeEach(() => {
		mailProvider = new InMemorySmtpMailProvider();
		usersRepository = new InMemoryUsersRepository();
		authLinksRepository = new InMemoryAuthLinksRepository();
		mailsRepository = new InMemorySmtpMailRepository(mailProvider);

		sut = new SendAuthLinkUseCase(
			authLinksRepository,
			usersRepository,
			mailsRepository,
		);
	});

	it("should sucessfully send an authLink", async () => {
		const user = await usersRepository.create({
			email: "johndoe@gmail.com",
			name: "John doe",
			phone: "+99 (99) 999999999",
			role: "customer",
		});

		const authLink = await sut.execute({ email: user.email });

		expect(authLink).toEqual(expect.any(String));
	});

	it("should throw if user email is invalid", async () => {
		expect(
			sut.execute({ email: "some non existing e-mail" }),
		).rejects.toBeInstanceOf(UnauthorizedError);
	});
});
