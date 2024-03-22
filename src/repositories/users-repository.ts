import type { User } from "@/database/schemas";
import type { CreateUserSchema } from "@/schemas/user-schemas";

export interface UsersRepository {
	create({ email, name, phone }: CreateUserSchema): Promise<User>;
	findById(id: string): Promise<User | null>;
	findByEmail(email: string): Promise<User | null>;
}
