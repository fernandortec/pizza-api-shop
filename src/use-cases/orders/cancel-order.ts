import type { Order } from "@/database/schemas";
import type { OrdersRepository } from "@/repositories/orders-repository";
import { OrderAlreadyDispatchedError } from "@/use-cases/_errors/order-already-dispatched-error";
import { ResourceNotFoundError } from "@/use-cases/_errors/resource-not-found-error";

export class CancelOrderUseCase {
	constructor(private ordersRepository: OrdersRepository) {}

	async execute(orderId: string): Promise<Order> {
		const order = await this.ordersRepository.findById(orderId);

		if (!order) throw new ResourceNotFoundError();
		if (!["pending", "processing"].includes(order.status))
			throw new OrderAlreadyDispatchedError();

		const canceledOrder = await this.ordersRepository.update({
			id: order.id,
			status: "canceled",
		});

		return canceledOrder;
	}
}
