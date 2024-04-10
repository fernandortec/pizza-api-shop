import { randomUUID } from "node:crypto";
import type { Order, OrderWCustomer } from "@/database/schemas";
import type { OrdersRepository } from "@/repositories/orders-repository";
import type { CreateOrderSchema } from "@/schemas/orders-schemas";

export class InMemoryOrdersRepository implements OrdersRepository {
	private orders: Order[] = [];

	async create({
		customerId,
		restaurantId,
		status,
		totalInCents,
	}: CreateOrderSchema): Promise<Order> {
		const order: Order = {
			id: randomUUID(),
			customerId,
			restaurantId,
			status,
			totalInCents,
			createdAt: new Date(),
		};

		this.orders.push(order);

		return order;
	}

	async findById(id: string): Promise<OrderWCustomer | null> {
		const order = this.orders.find((order) => order.id === id);
		if (!order) return null;

    return order
	}
}
