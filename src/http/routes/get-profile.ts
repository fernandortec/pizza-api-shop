import { auth } from "@/http/plugins/auth";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { makeGetProfileUseCase } from "@/use-cases/factories/make-get-profile-use-case";
import { Elysia } from "elysia";

export const getProfile = new Elysia()
	.use(auth)
	.error({ NOT_FOUND: ResourceNotFoundError })
	.get(
		"/me",
		async ({ getCurrentUser }) => {
			const { userId } = await getCurrentUser();

			const getProfileUseCase = makeGetProfileUseCase();

			const user = await getProfileUseCase.execute(userId);

			return user;
		},
		{
			error: ({ code, set }) => {
				switch (code) {
					case "NOT_FOUND":
						set.status = 404;
						return { message: "Profile not found" };
				}
			},
		},
	);
