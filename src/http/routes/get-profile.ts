import { db } from "@/database/connection";
import { users } from "@/database/schemas";
import { auth } from "@/plugins/auth";
import { UnauthorizedError } from "@/use-cases/errors/unauthorized-error";
import { eq } from "drizzle-orm";
import { Elysia } from "elysia";

export const getProfile = new Elysia()
	.use(auth)
	.get("/me", async ({ getCurrentUser }) => {
		const { userId } = await getCurrentUser();

		const [user] = await db.select().from(users).where(eq(users.id, userId));

		if (!user) throw new UnauthorizedError();

		return user;
	});
