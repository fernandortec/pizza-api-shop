import { t, type Static } from "elysia";

const createUserSchema = t.Object({
	name: t.String(),
	email: t.String(),
	phone: t.String(),
	role: t.Optional(t.Union([t.Literal("customer"), t.Literal("manager")])),
});

const updateUserSchema = t.Object({
	id: t.String(),
	email: t.Optional(t.String()),
	name: t.Optional(t.String()),
	phone: t.Optional(t.String()),
	role: t.Optional(t.Union([t.Literal("customer"), t.Literal("manager")])),
	updatedAt: t.Date(),
});

export type UpdateUserSchema = Static<typeof updateUserSchema>;
export type CreateUserSchema = Static<typeof createUserSchema>;
