import type {
	OrderWithDetails,
	OrdersRepository,
} from "@/repositories/orders-repository";
import { ResourceNotFoundError } from "@/use-cases/_errors/resource-not-found-error";

export class GetOrderDetailsUseCase {
	constructor(private ordersRepository: OrdersRepository) {}
	async execute(id: string): Promise<OrderWithDetails> {
		const order = await this.ordersRepository.findById(id);

		if (!order) throw new ResourceNotFoundError();

		return order;
	}
}
