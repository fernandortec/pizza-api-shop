import { DrizzleOrdersRepository } from "@/repositories/drizzle/drizzle-orders-repository";
import { CancelOrderUseCase } from "@/use-cases/orders/cancel-order";

export function makeCancelOrderUseCase(): CancelOrderUseCase {
	const ordersRepository = new DrizzleOrdersRepository();
	const cancelOrderUseCase = new CancelOrderUseCase(ordersRepository);

	return cancelOrderUseCase;
}
