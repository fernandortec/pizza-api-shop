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
import type {
	CreateOrderSchema,
	FindByCustomerAndRestaurantSchema,
	UpdateOrderSchema,
} from "@/schemas/orders-schemas";
import { and, eq } from "drizzle-orm";

export class DrizzleOrdersRepository implements OrdersRepository {
	async create({
		customerId,
		restaurantId,
		status,
		totalInCents,
	}: CreateOrderSchema): Promise<Order> {
		const [order] = await db
			.insert(orders)
			.values({ restaurantId, totalInCents, customerId, status })
			.returning();

		return order;
	}

	async update({
		id,
		status,
		totalInCents,
	}: UpdateOrderSchema): Promise<Order> {
		const [order] = await db
			.update(orders)
			.set({ status, totalInCents })
			.where(eq(orders.id, id))
			.returning();

		return order;
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

	async findByCustomerAndRestaurant({
		restaurantId,
		customerId,
	}: FindByCustomerAndRestaurantSchema): Promise<Order | null> {
		const [order] = await db
			.select()
			.from(orders)
			.where(
				and(
					eq(orders.customerId, customerId),
					eq(orders.restaurantId, restaurantId),
				),
			);

		return order;
	}
}
