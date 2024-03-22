import { DrizzleAuthLinksRepository } from "@/repositories/drizzle/drizzle-auth-links-repository";
import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository";
import { SmtpMailsRepository } from "@/repositories/smtp/smtp-mails-repository";
import { sendAuthLinkSchema } from "@/schemas/auth-links-schemas";
import nodemailer from "nodemailer";

import { UnauthorizedError } from "@/use-cases/errors/unauthorized-error";
import { SendAuthLinkUseCase } from "@/use-cases/send-auth-link";
import { Elysia } from "elysia";

export const sendAuthLink = new Elysia()
	.error({ UNAUTHORIZED: UnauthorizedError })
	.onError(({ set, code }) => {
		switch (code) {
			case "UNAUTHORIZED":
				set.status = 401;
				return { message: "Unauthorized, use a vaild email" };
		}
	})
	.post(
		"/authenticate",
		async ({ body }) => {
			const { email } = body;

			const mailRepository = new SmtpMailsRepository(nodemailer);
			const usersRepository = new DrizzleUsersRepository();
			const authLinksRepository = new DrizzleAuthLinksRepository();

			const sendAuthLinkUseCase = new SendAuthLinkUseCase(
				authLinksRepository,
				usersRepository,
				mailRepository,
			);

			const redirectURL = await sendAuthLinkUseCase.execute({ email });

			return redirectURL;
		},
		{
			body: sendAuthLinkSchema,
		},
	);
