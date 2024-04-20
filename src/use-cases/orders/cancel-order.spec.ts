import { InMemoryOrdersRepository } from "@/repositories/in-memory/in-memory-orders-repository";
import type { OrdersRepository } from "@/repositories/orders-repository";
import { OrderAlreadyDispatchedError } from "@/use-cases/_errors/order-already-dispatched-error";
import { OrderMustBePendingError } from "@/use-cases/_errors/order-must-be-pending-error";
import { ResourceNotFoundError } from "@/use-cases/_errors/resource-not-found-error";
import { CancelOrderUseCase } from "@/use-cases/orders/cancel-order";
import { beforeEach, describe, expect, it } from "bun:test";

describe("Cancel order use case", () => {
	let ordersRepository: OrdersRepository;
	let sut: CancelOrderUseCase;

	beforeEach(() => {
		ordersRepository = new InMemoryOrdersRepository();
		sut = new CancelOrderUseCase(ordersRepository);
	});

	it("should be able to cancel an order", async () => {
		const order = await ordersRepository.create({
			customerId: "fake-customer-id",
			restaurantId: "fake-restaurant-id",
			status: "pending",
			totalInCents: 1290,
		});

		const canceled = await sut.execute(order.id);

		expect(canceled).toEqual(
			expect.objectContaining({ id: order.id, status: "canceled" }),
		);
	});

	it("should throw if order has already been dispatched", async () => {
		const order = await ordersRepository.create({
			customerId: "fake-customer-id",
			restaurantId: "fake-restaurant-id",
			status: "delivering",
			totalInCents: 1290,
		});

		expect(sut.execute(order.id)).rejects.toBeInstanceOf(
			OrderAlreadyDispatchedError,
		);
	});

	it("should throw if order id does not belong to an order", async () => {
		expect(sut.execute("fake-order-id")).rejects.toBeInstanceOf(
			ResourceNotFoundError,
		);
	});
});
