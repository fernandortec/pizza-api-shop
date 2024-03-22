import { type Static, t } from "elysia";

export const jwtSchema = t.Object({
	sub: t.String(),
	restaurantId: t.Optional(t.String()),
});

export type JwtSchema = Static<typeof jwtSchema>;
