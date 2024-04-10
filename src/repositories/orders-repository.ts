import type { Order, OrderWCustomer } from "@/database/schemas";
import type { CreateOrderSchema } from "@/schemas/orders-schemas";

export interface OrdersRepository {
	create({
		customerId,
		restaurantId,
		status,
		totalInCents,
	}: CreateOrderSchema): Promise<Order>;
	findById(id: string): Promise<OrderWCustomer | null>;
}
