import { db } from "@/database/connection";
import {
	type Order,
	orderItems,
	orders,
	products,
	users,
} from "@/database/schemas";
import type {
	OrderWithDetails,
	OrdersRepository,
} from "@/repositories/orders-repository";
import type { CreateOrderSchema } from "@/schemas/orders-schemas";
import { eq } from "drizzle-orm";

export class DrizzleOrdersRepository implements OrdersRepository {
	async create({
		customerId,
		restaurantId,
		status,
		totalInCents,
	}: CreateOrderSchema): Promise<Order> {
		throw new Error("Method not implemented.");
	}
	async findById(id: string): Promise<OrderWithDetails> {
		const [order] = await db
			.select({
				id: orders.id,
				status: orders.status,
				totalInCents: orders.totalInCents,
				createdAt: orders.createdAt,
				customer: {
					name: users.name,
					email: users.email,
					phone: users.phone,
				},
				orderItems: {
					id: orderItems.id,
					priceInCents: orderItems.priceInCents,
					quantity: orderItems.quantity,
				},
				product: {
					name: products.name,
				},
			})
			.from(orders)
			.where(eq(orders.id, id))
			.leftJoin(users, eq(orders.customerId, users.id))
			.leftJoin(orderItems, eq(orders.id, orderItems.orderId))
			.leftJoin(products, eq(orderItems.productId, products.id))
			.limit(1);

		return order;
	}
}
