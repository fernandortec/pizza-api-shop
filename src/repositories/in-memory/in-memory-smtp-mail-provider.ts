import type { MailProvider } from "@/repositories/mails-repository";
import type { SentMessageInfo, TestAccount } from "nodemailer";
import type { Options } from "nodemailer/lib/mailer";

import type SMTPTransport from "nodemailer/lib/smtp-transport";

type TransportResponse = { sendMail: (options: Options) => SentMessageInfo };

export class InMemorySmtpMailProvider implements MailProvider {
	async createTestAccount(_p?: string): Promise<TestAccount> {
		return {
			web: "www",
			user: "user",
			pass: "pass",
			imap: { host: "http://localhost", port: 5000, secure: true },
			pop3: { host: "http://localhost", port: 5001, secure: true },
			smtp: { host: "http://localhost", port: 5002, secure: true },
		};
	}

	createTransport(
		_o: SMTPTransport | SMTPTransport.Options,
	): TransportResponse {
		return {
			sendMail: (_) => ({
				envelope: {
					from: "hi@inmemorymail.com",
					to: ["test@inmemory.com"],
				},
				messageId: "<02222440b-fced-3de1-2ad1-f050416ae2a7@inmemorymail.com>",
			}),
		};
	}

	getTestMessageUrl({
		messageId,
	}: SMTPTransport.SentMessageInfo): string | false {
		if (!messageId) return false;
		return "http://localhost/fake-messageurl";
	}
}
