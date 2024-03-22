import { type Static, t } from "elysia";

export const createAuthLinkSchema = t.Object({
	code: t.String(),
	userId: t.String(),
});

export type CreateAuthLinkSchema = Static<typeof createAuthLinkSchema>;

export const sendAuthLinkSchema = t.Object({
	email: t.String({ format: "email", default: "email@fake.com" }),
});

export type SendAuthLinkSchema = Static<typeof sendAuthLinkSchema>;
