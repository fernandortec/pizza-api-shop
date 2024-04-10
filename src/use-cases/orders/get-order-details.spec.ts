import { beforeEach, describe, it } from "bun:test";
import { InMemoryOrdersRepository } from "@/repositories/in-memory/in-memory-orders-repository";
import type { OrdersRepository } from "@/repositories/orders-repository";
import { GetOrderDetailsUseCase } from "@/use-cases/orders/get-order-details";

describe("Get order details use case", () => {
	let ordersRepository: OrdersRepository;
	let sut: GetOrderDetailsUseCase;

	beforeEach(() => {
		ordersRepository = new InMemoryOrdersRepository();
		sut = new GetOrderDetailsUseCase(ordersRepository);
	});

	it("should be able to get an order ", async () => {
    

    const order = await ordersRepository.create({customerId:})

		expect("ok").toBe("ok");
	});
});
