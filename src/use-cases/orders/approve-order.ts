import type { Order } from "@/database/schemas";
import type { OrdersRepository } from "@/repositories/orders-repository";
import { OrderMustBePendingError } from "@/use-cases/_errors/order-must-be-pending-error";
import { ResourceNotFoundError } from "@/use-cases/_errors/resource-not-found-error";

export class ApproveOrderUseCase {
	constructor(private ordersRepository: OrdersRepository) {}

	async execute(orderId: string): Promise<Order> {
		const order = await this.ordersRepository.findById(orderId);

		if (!order) throw new ResourceNotFoundError();
		if (order.status !== "pending") throw new OrderMustBePendingError();

		const approvedOrder = await this.ordersRepository.update({
			id: order.id,
			status: "processing",
		});

		return approvedOrder;
	}
}
