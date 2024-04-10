import type { Order, OrderItems, Product, User } from "@/database/schemas";
import type { CreateOrderSchema } from "@/schemas/orders-schemas";

export interface OrderWithDetails
	extends Pick<Order, "id" | "status" | "totalInCents" | "createdAt"> {
	customer: {
		name: User["name"];
		email: User["email"];
		phone: User["phone"];
	} | null;
	orderItems: {
		id: OrderItems["id"];
		priceInCents: OrderItems["priceInCents"];
		quantity: OrderItems["quantity"];
	} | null; 
	product: {
		name: Product["name"];
	} | null;
}
export interface OrdersRepository {
	create({
		customerId,
		restaurantId,
		status,
		totalInCents,
	}: CreateOrderSchema): Promise<Order>;
	findById(id: string): Promise<OrderWithDetails | null>;
}
