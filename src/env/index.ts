import { Value } from "@sinclair/typebox/value";
import { t } from "elysia";

const envSchema = t.Object(
	{
		DATABASE_URL: t.String({ minLength: 1 }),
		API_BASE_URL: t.String({ minLength: 1 }),
		AUTH_REDIRECT_URL: t.String({ minLength: 1 }),
		JWT_SECRET_KEY: t.String({ minLength: 1 }),
		NODE_ENV: t.Union([
			t.Literal("development"),
			t.Literal("production"),
			t.Literal("test"),
			t.Literal("qa"),
		]),
	},
	{ additionalProperties: true },
);

export const env = Value.Decode(envSchema, process.env);
