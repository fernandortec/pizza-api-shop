import type { Order } from "@/database/schemas";
import type { OrdersRepository } from "@/repositories/orders-repository";
import { OrderMustBeProcessingError } from "@/use-cases/_errors/order-must-be-processing-error";
import { ResourceNotFoundError } from "@/use-cases/_errors/resource-not-found-error";

export class DispatchOrderUseCase {
	constructor(private ordersRepository: OrdersRepository) {}

	async execute(orderId: string): Promise<Order> {
		const order = await this.ordersRepository.findById(orderId);

		if (!order) throw new ResourceNotFoundError();
		if (order.status !== "processing") throw new OrderMustBeProcessingError();

		const dispatchedOrder = await this.ordersRepository.update({
			id: order.id,
			status: "delivered",
		});

		return dispatchedOrder;
	}
}
