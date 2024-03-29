import { type JwtSchema, jwtSchema } from "@/schemas/auth-schemas";
import { UnauthorizedError } from "@/use-cases/errors/unauthorized-error";
import cookie from "@elysiajs/cookie";
import jwt from "@elysiajs/jwt";
import { Elysia } from "elysia";
import { env } from "../../env";

export const auth = new Elysia()
	.use(
		jwt({
			secret: env.JWT_SECRET_KEY,
			schema: jwtSchema,
		}),
	)
	.use(cookie({}))
	.derive(({ jwt: { sign, verify }, setCookie, removeCookie, cookie }) => {
		return {
			signUser: async (payload: JwtSchema) => {
				const token = await sign(payload);

				setCookie("auth", token, {
					httpOnly: true,
					maxAge: 60 * 60 * 24 * 7, // 7 days,
					path: "/",
				});
			},

			signOut: () => {
				removeCookie("auth");
			},

			getCurrentUser: async () => {
				const payload = await verify(cookie.auth);

				return {
					userId: payload ? payload.sub : null,
					restaurantId: payload ? payload.restaurantId : null,
				};
			},
		};
	});
