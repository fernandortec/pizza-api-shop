import { env } from "@/env";
import { type JwtSchema, jwtSchema } from "@/schemas/auth-schemas";
import cookie from "@elysiajs/cookie";
import { jwt } from "@elysiajs/jwt";
import { Elysia } from "elysia";

interface AuthDerivedMethods extends Record<string, unknown> {
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
		({ jwt: { sign, verify }, headers, setCookie }): AuthDerivedMethods => ({
			signUser: async (payload: JwtSchema): Promise<string> => {
				const token = await sign(payload);

				setCookie("auth", token, {
					httpOnly: true,
					maxAge: 60 * 60 * 24 * 7, // 7 days,
					path: "/",
				});

				return token;
			},

			getCurrentUser: async (): Promise<GetCurrentUserResponse> => {
				const payload = await verify(headers.Authorization);

				return {
					userId: payload ? payload.sub : null,
					restaurantId: payload ? payload.restaurantId : null,
				};
			},
		}),
	);
