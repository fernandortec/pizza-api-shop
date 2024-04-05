import { type Static, t } from "elysia";

export const createAuthLinkSchema = t.Object({
	code: t.String(),
	userId: t.String(),
	createdAt: t.Optional(t.Date()),
});

export type CreateAuthLinkSchema = Static<typeof createAuthLinkSchema>;

export const sendAuthLinkSchema = t.Object({
	email: t.String({ format: "email", default: "fake@email.com" }),
});

export type SendAuthLinkSchema = Static<typeof sendAuthLinkSchema>;

export const authFromLinkSchema = t.Object({
	code: t.String(),
	redirect: t.String(),
});

export type AuthFromLinkSchema = Static<typeof authFromLinkSchema>;
