import { InMemoryOrdersRepository } from "@/repositories/in-memory/in-memory-orders-repository";
import type { OrdersRepository } from "@/repositories/orders-repository";
import { OrderAlreadyDispatchedError } from "@/use-cases/_errors/order-already-dispatched-error";
import { OrderNotDelivering } from "@/use-cases/_errors/order-not-delivering-error";
import { ResourceNotFoundError } from "@/use-cases/_errors/resource-not-found-error";
import { DeliverOrderUseCase } from "@/use-cases/orders/deliver-order";
import { beforeEach, describe, expect, it } from "bun:test";

describe("Deliver order use case", () => {
	let ordersRepository: OrdersRepository;
	let sut: DeliverOrderUseCase;

	beforeEach(() => {
		ordersRepository = new InMemoryOrdersRepository();
		sut = new DeliverOrderUseCase(ordersRepository);
	});

	it("should be able to deliver an order", async () => {
		const order = await ordersRepository.create({
			customerId: "fake-customer-id",
			restaurantId: "fake-restaurant-id",
			status: "delivering",
			totalInCents: 1290,
		});

		const delivered = await sut.execute(order.id);

		expect(delivered).toEqual(
			expect.objectContaining({ id: order.id, status: "delivered" }),
		);
	});

	it("should throw if order status is not delivering", async () => {
		const order = await ordersRepository.create({
			customerId: "fake-customer-id",
			restaurantId: "fake-restaurant-id",
			status: "processing",
			totalInCents: 1290,
		});

		expect(sut.execute(order.id)).rejects.toBeInstanceOf(OrderNotDelivering);
	});

	it("should throw if order id does not belong to an order", async () => {
		expect(sut.execute("fake-order-id")).rejects.toBeInstanceOf(
			ResourceNotFoundError,
		);
	});
});
