import { DrizzleOrdersRepository } from "@/repositories/drizzle/drizzle-orders-repository";
import { GetOrderDetailsUseCase } from "@/use-cases/get-order-details";

export const makeGetOrderDetailsUseCase = (): GetOrderDetailsUseCase => {
	const ordersRepository = new DrizzleOrdersRepository();
	const getOrderDetailsUseCase = new GetOrderDetailsUseCase(ordersRepository);

	return getOrderDetailsUseCase;
};
