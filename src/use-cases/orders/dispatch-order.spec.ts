import { InMemoryOrdersRepository } from "@/repositories/in-memory/in-memory-orders-repository";
import type { OrdersRepository } from "@/repositories/orders-repository";
import { OrderMustBeProcessingError } from "@/use-cases/_errors/order-must-be-processing-error";
import { OrderNotDelivering } from "@/use-cases/_errors/order-not-delivering-error";
import { ResourceNotFoundError } from "@/use-cases/_errors/resource-not-found-error";
import { DispatchOrderUseCase } from "@/use-cases/orders/dispatch-order";
import { beforeEach, describe, expect, it } from "bun:test";

describe("Dispatch order use case", () => {
	let ordersRepository: OrdersRepository;
	let sut: DispatchOrderUseCase;

	beforeEach(() => {
		ordersRepository = new InMemoryOrdersRepository();
		sut = new DispatchOrderUseCase(ordersRepository);
	});

	it("should be able to dispatch an order", async () => {
		const order = await ordersRepository.create({
			customerId: "fake-customer-id",
			restaurantId: "fake-restaurant-id",
			status: "processing",
			totalInCents: 1290,
		});

		const dispatched = await sut.execute(order.id);

		expect(dispatched).toEqual(
			expect.objectContaining({ id: order.id, status: "delivered" }),
		);
	});

	it("should throw if order status is not processing", async () => {
		const order = await ordersRepository.create({
			customerId: "fake-customer-id",
			restaurantId: "fake-restaurant-id",
			status: "canceled",
			totalInCents: 1290,
		});

		expect(sut.execute(order.id)).rejects.toBeInstanceOf(OrderMustBeProcessingError);
	});

	it("should throw if order id does not belong to an order", async () => {
		expect(sut.execute("fake-order-id")).rejects.toBeInstanceOf(
			ResourceNotFoundError,
		);
	});
});
