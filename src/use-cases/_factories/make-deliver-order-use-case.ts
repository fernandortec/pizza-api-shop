import { DrizzleOrdersRepository } from "@/repositories/drizzle/drizzle-orders-repository";
import { DeliverOrderUseCase } from "@/use-cases/orders/deliver-order";

export function makeDeliverOrderUseCase(): DeliverOrderUseCase {
	const ordersRepository = new DrizzleOrdersRepository();
	const deliverOrdersUseCase = new DeliverOrderUseCase(ordersRepository);

	return deliverOrdersUseCase;
}
