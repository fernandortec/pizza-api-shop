import { env } from "@/env";
import { type JwtSchema, jwtSchema } from "@/schemas/auth-schemas";
import cookie from "@elysiajs/cookie";
import { jwt } from "@elysiajs/jwt";
import { Elysia } from "elysia";


export const auth = new Elysia()
	.use(
		jwt({
			name: "jwt",
			secret: env.JWT_SECRET_KEY,
			schema: jwtSchema
		}),
	)
	.use(cookie())
	.derive(
		{ as: "global" },
		({ setCookie, removeCookie, cookie, jwt: { sign, verify } }) => {
			return {
				signUser: async (payload: JwtSchema) => {
					const token = await sign(payload);
					console.log(token)
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
		},
	);
