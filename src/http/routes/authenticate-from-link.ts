import { auth } from "@/http/plugins/auth";
import { authFromLinkSchema } from "@/schemas/auth-links-schemas";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { makeAuthFromLinkUseCase } from "@/use-cases/factories/make-auth-from-link-use-case";
import { Elysia } from "elysia";

export const authenticateFromLink = new Elysia()
	.use(auth)
	.error({ NOT_FOUND: ResourceNotFoundError })
	.get(
		"/auth-links/authenticate",
		async ({ query, set, signUser }) => {
			const { code, redirect } = query;

			const authLinkUseCase = makeAuthFromLinkUseCase();

			const userData = await authLinkUseCase.execute({ code, redirect });

			await signUser({
				sub: userData.userId,
				restaurantId: userData?.restaurantId,
			});

			set.redirect = redirect;
		},
		{
			query: authFromLinkSchema,
			error: ({ code, set }) => {
				switch (code) {
					case "NOT_FOUND":
						set.status = 404;
						return { message: "Auth link not found" };
				}
			},
		},
	);
