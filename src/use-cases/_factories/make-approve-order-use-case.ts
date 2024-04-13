import { DrizzleOrdersRepository } from "@/repositories/drizzle/drizzle-orders-repository";
import { ApproveOrderUseCase } from "@/use-cases/orders/approve-order";

export function makeApproveOrderUseCase(): ApproveOrderUseCase {
	const ordersRepository = new DrizzleOrdersRepository();
	const approveOrderUseCase = new ApproveOrderUseCase(ordersRepository);

	return approveOrderUseCase;
}
