import { env } from "@/env";
import cookie from "@/helpers/cookie";
import { type JwtSchema, jwtSchema } from "@/schemas/auth-schemas";

import { jwt } from "@elysiajs/jwt";
import { Elysia } from "elysia";

interface AuthDerivedMethods extends Record<string, unknown> {
	readonly signOut: () => void;
	readonly signUser: (payload: JwtSchema) => Promise<string>;
	readonly getCurrentUser: () => Promise<GetCurrentUserResponse>;
}

interface GetCurrentUserResponse {
	userId: string | null;
	restaurantId?: string | null;
}

export const auth = new Elysia()
	.use(
		jwt({
			name: "jwt",
			secret: env.JWT_SECRET_KEY,
			schema: jwtSchema,
		}),
	)
	.use(cookie({}))
	.derive(
		{ as: "global" },
		({
			jwt: { sign, verify },
			headers,
			setCookie,
			removeCookie,
		}): AuthDerivedMethods => ({
			signUser: async (payload: JwtSchema): Promise<string> => {
				const token = await sign(payload);

				setCookie("auth", token, {
					httpOnly: true,
					maxAge: 60 * 60 * 24 * 7, // 7 days,
					path: "/",
				});

				return token;
			},

			signOut: (): void => {
				removeCookie("auth");
			},

			getCurrentUser: async (): Promise<GetCurrentUserResponse> => {
				const payload = await verify(
					headers.authorization || headers.Authorization,
				);

				return {
					userId: payload ? payload.sub : null,
					restaurantId: payload ? payload.restaurantId : null,
				};
			},
		}),
	);
