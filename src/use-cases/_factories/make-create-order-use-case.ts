import { DrizzleOrdersRepository } from "@/repositories/drizzle/drizzle-orders-repository";
import { CreateOrderUseCase } from "@/use-cases/orders/create-order";

export function makeCreateOrderUseCase(): CreateOrderUseCase {
	const ordersRepository = new DrizzleOrdersRepository();
	const createOrderUseCase = new CreateOrderUseCase(ordersRepository);

	return createOrderUseCase;
}
