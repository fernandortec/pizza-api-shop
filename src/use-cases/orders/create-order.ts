import type { Order } from "@/database/schemas";
import type { OrdersRepository } from "@/repositories/orders-repository";
import type { CreateOrderSchema } from "@/schemas/orders-schemas";
import { OrderCooldownExceededError } from "@/use-cases/_errors/order-cooldown-exceeded-error";
import dayjs from "dayjs";

export class CreateOrderUseCase {
	constructor(private ordersRepository: OrdersRepository) {}
	async execute({
		customerId,
		restaurantId,
		status,
		totalInCents,
	}: CreateOrderSchema): Promise<Order> {
		const didCustomerOrderBefore =
			await this.ordersRepository.findByCustomerAndRestaurant({
				customerId,
				restaurantId,
			});

		if (didCustomerOrderBefore) {
			const previousOrder = didCustomerOrderBefore;
			const distanceInMinutesFromPreviousOrderCreation = dayjs(new Date()).diff(
				previousOrder.createdAt,
				"minutes",
			);

			if (distanceInMinutesFromPreviousOrderCreation < 5) throw new OrderCooldownExceededError();
		}

		const order = await this.ordersRepository.create({
			customerId,
			restaurantId,
			status,
			totalInCents,
		});

		return order;
	}
}
