import { DrizzleAuthLinksRepository } from "@/repositories/drizzle/drizzle-auth-links-repository";
import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository";
import { SmtpMailsRepository } from "@/repositories/smtp/smtp-mails-repository";
import { SendAuthLinkUseCase } from "@/use-cases/send-auth-link";
import nodemailer from "nodemailer";

export function makeSendAuthLinkUseCase() {
	const mailRepository = new SmtpMailsRepository(nodemailer);
	const usersRepository = new DrizzleUsersRepository();
	const authLinksRepository = new DrizzleAuthLinksRepository();

	const sendAuthLinkUseCase = new SendAuthLinkUseCase(
		authLinksRepository,
		usersRepository,
		mailRepository,
	);

	return sendAuthLinkUseCase;
}
