import { sendAuthLinkSchema } from "@/schemas/auth-links-schemas";

import { UnauthorizedError } from "@/use-cases/_errors/unauthorized-error";
import { makeSendAuthLinkUseCase } from "@/use-cases/_factories/make-send-auth-link-use-case";
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
		"/auth-links/send",
		async ({ body }) => {
			const { email } = body;

			const sendAuthLinkUseCase = makeSendAuthLinkUseCase();

			const redirectURL = await sendAuthLinkUseCase.execute({ email });

			return redirectURL;
		},
		{
			body: sendAuthLinkSchema,
		},
	);
