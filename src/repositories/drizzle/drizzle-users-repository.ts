import { db } from "@/database/connection";
import { users, type User } from "@/database/schemas";
import type { UsersRepository } from "@/repositories/users-repository";
import type { CreateUserSchema } from "@/schemas/user-schemas";
import { eq } from "drizzle-orm";

export class DrizzleUsersRepository implements UsersRepository {
	async create({ email, name, phone }: CreateUserSchema): Promise<User> {
		const [user] = await db
			.insert(users)
			.values({ email, name, phone })
			.returning();

		return user;
	}

	async findById(id: string): Promise<User | null> {
		const [user] = await db.select().from(users).where(eq(users.id, id));

		return user ?? null;
	}

	async findByEmail(email: string): Promise<User | null> {
		const [user] = await db.select().from(users).where(eq(users.email, email));

		return user ?? null;
	}
}
