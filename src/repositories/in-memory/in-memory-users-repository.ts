import type { User } from "@/database/schemas";
import type { UsersRepository } from "@/repositories/users-repository";
import type { CreateUserSchema } from "@/schemas/user-schemas";
import { createId } from "@paralleldrive/cuid2";

export class InMemoryUsersRepository implements UsersRepository {
	private users: User[] = [];

	async create({ email, name, phone, role }: CreateUserSchema): Promise<User> {
		const user: User = {
			id: createId(),
			name,
			email,
			phone,
			role: role ?? "customer",
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		this.users.push(user);

		return user;
	}

	async findById(id: string): Promise<User | null> {
		const user = this.users.find((user) => user.id === id);

		if (!user) return null;
		return user;
	}

	async findByEmail(email: string): Promise<User | null> {
		const user = this.users.find((user) => user.email === email);

		if (!user) return null;
		return user;
	}
}
