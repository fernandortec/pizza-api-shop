import type { Order } from "@/database/schemas";
import type { OrdersRepository } from "@/repositories/orders-repository";
import { OrderMustBePendingError } from "@/use-cases/_errors/order-must-be-pending-error";
import { OrderNotDelivering } from "@/use-cases/_errors/order-not-delivering-error";
import { ResourceNotFoundError } from "@/use-cases/_errors/resource-not-found-error";

export class DeliverOrderUseCase {
	constructor(private ordersRepository: OrdersRepository) {}

	async execute(orderId: string): Promise<Order> {
		const order = await this.ordersRepository.findById(orderId);

		if (!order) throw new ResourceNotFoundError();
		if (order.status !== "delivering")
			throw new OrderNotDelivering();

		const deliveredOrder = await this.ordersRepository.update({
			id: order.id,
			status: "delivered",
		});

		return deliveredOrder;
	}
}
