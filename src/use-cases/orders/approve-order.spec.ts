import { InMemoryOrdersRepository } from "@/repositories/in-memory/in-memory-orders-repository";
import type { OrdersRepository } from "@/repositories/orders-repository";
import { OrderMustBePendingError } from "@/use-cases/_errors/order-must-be-pending-error";
import { ResourceNotFoundError } from "@/use-cases/_errors/resource-not-found-error";
import { ApproveOrderUseCase } from "@/use-cases/orders/approve-order";
import { beforeEach, describe, it, expect } from "bun:test";

describe("Approve order use case", () => {
	let ordersRepository: OrdersRepository;
	let sut: ApproveOrderUseCase;

	beforeEach(() => {
		ordersRepository = new InMemoryOrdersRepository();
		sut = new ApproveOrderUseCase(ordersRepository);
	});

	it("should be able to approve an order", async () => {
		const order = await ordersRepository.create({
			customerId: "fake-customer-id",
			restaurantId: "fake-restaurant-id",
			status: "pending",
			totalInCents: 1290,
		});

		const approvedOrder = await sut.execute(order.id);

		expect(approvedOrder).toEqual(
			expect.objectContaining({ id: order.id, status: "processing" }),
		);
	});

	it("should throw if order is not pending", async () => {
		const order = await ordersRepository.create({
			customerId: "fake-customer-id",
			restaurantId: "fake-restaurant-id",
			status: "processing",
			totalInCents: 1290,
		});

		expect(sut.execute(order.id)).rejects.toBeInstanceOf(
			OrderMustBePendingError,
		);
	});

	it("should throw if order id does not belong to an order", async () => {
		expect(sut.execute("fake-order-id")).rejects.toBeInstanceOf(
			ResourceNotFoundError,
		);
	});

	it("after approving, expect all order fields to remain the same as they were", async () => {
		const order = await ordersRepository.create({
			customerId: "fake-customer-id",
			restaurantId: "fake-restaurant-id",
			status: "pending",
			totalInCents: 1290,
		});

		const approvedOrder = await sut.execute(order.id);

		expect(approvedOrder).toEqual(
			expect.objectContaining({
				id: order.id,
				status: "processing",
				totalInCents: order.totalInCents,
				customerId: order.customerId,
				restaurantId: order.restaurantId,
			}),
		);
	});
});
