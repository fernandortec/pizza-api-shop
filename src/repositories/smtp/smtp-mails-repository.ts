import type {
	MailProvider,
	MailsRepository,
} from "@/repositories/mails-repository";
import { type SentMessageInfo } from "nodemailer";
import type { Options } from "nodemailer/lib/mailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

export class SmtpMailsRepository implements MailsRepository {
	constructor(private mailProvider: MailProvider) {}

	async sendMail(options: Options): Promise<SentMessageInfo> {
		const account = await this.mailProvider.createTestAccount();

		const mail = this.mailProvider.createTransport({
			host: account.smtp.host,
			port: account.smtp.port,
			secure: account.smtp.secure,
			debug: true,
			auth: {
				user: account.user,
				pass: account.pass,
			},
		});

		const mailInfo = await mail.sendMail(options);

		return mailInfo;
	}

	getMessage(info: SMTPTransport.SentMessageInfo): string | false {
		const message = this.mailProvider.getTestMessageUrl(info);

		return message;
	}
}
