import { randomUUID } from "node:crypto";
import type { Order } from "@/database/schemas";
import type {
	OrderWithDetails,
	OrdersRepository,
} from "@/repositories/orders-repository";
import type {
	CreateOrderSchema,
	FindByCustomerAndRestaurantSchema,
	UpdateOrderSchema,
} from "@/schemas/orders-schemas";
import { ResourceNotFoundError } from "@/use-cases/_errors/resource-not-found-error";

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
	async update({
		id,
		status,
		totalInCents,
	}: UpdateOrderSchema): Promise<Order> {
		const orderIdx = this.orders.findIndex((order) => order.id === id);
		if (orderIdx !== 0) throw new ResourceNotFoundError();

		const order = this.orders[orderIdx];

		order.status = status ? status : order.status;
		order.totalInCents = totalInCents ? totalInCents : order.totalInCents;

		this.orders[orderIdx] = order;

		return order;
	}

	async findById(id: string): Promise<OrderWithDetails | null> {
		const order = this.orders.find((order) => order.id === id);
		if (!order) return null;

		const orderWithDetails: OrderWithDetails = {
			id: order.id,
			status: order.status,
			totalInCents: order.totalInCents,
			createdAt: order.createdAt,
			customer: null,
			orderItems: null,
			product: null,
		};

		return orderWithDetails;
	}

	async findByCustomerAndRestaurant({
		restaurantId,
		customerId,
	}: FindByCustomerAndRestaurantSchema): Promise<Order | null> {
		const order = this.orders.find(
			(order) =>
				order.customerId === customerId && order.restaurantId === restaurantId,
		);

		if (!order) return null;

		return order;
	}
}
