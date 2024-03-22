import { type SentMessageInfo, type TestAccount } from "nodemailer";
import type { Options } from "nodemailer/lib/mailer";
import type SESTransport from "nodemailer/lib/ses-transport";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

export interface MailsRepository {
		sendMail(options: Options): Promise<SMTPTransport.SentMessageInfo>;
		getMessage(info: SMTPTransport.SentMessageInfo): string | false;
	}
export interface MailProvider {
	createTestAccount: (apiUrl?: string) => Promise<TestAccount>;
	getTestMessageUrl: (
		info: SESTransport.SentMessageInfo | SMTPTransport.SentMessageInfo,
	) => string | false;
	createTransport: (options: SMTPTransport.Options | SMTPTransport) => {
		sendMail: (options: Options) => SentMessageInfo;
	};
}
