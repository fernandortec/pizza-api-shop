import { beforeEach, describe, expect, it } from "bun:test";
import { InMemoryOrdersRepository } from "@/repositories/in-memory/in-memory-orders-repository";
import { InMemoryRestaurantsRepository } from "@/repositories/in-memory/in-memory-restaurants-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import type { OrdersRepository } from "@/repositories/orders-repository";
import type { RestaurantsRepository } from "@/repositories/restaurants-repository";
import type { UsersRepository } from "@/repositories/users-repository";
import { ResourceNotFoundError } from "@/use-cases/_errors/resource-not-found-error";
import { GetOrderDetailsUseCase } from "@/use-cases/orders/get-order-details";

describe("Get order details use case", () => {
	let ordersRepository: OrdersRepository;
	let usersRepository: UsersRepository;
	let restaurantsRepository: RestaurantsRepository;
	let sut: GetOrderDetailsUseCase;

	beforeEach(() => {
		ordersRepository = new InMemoryOrdersRepository();
		usersRepository = new InMemoryUsersRepository();
		restaurantsRepository = new InMemoryRestaurantsRepository();

		sut = new GetOrderDetailsUseCase(ordersRepository);
	});

	it("should be able to get an order with details", async () => {
		const manager = await usersRepository.create({
			email: "fake-email.com",
			name: "John doe",
			phone: "00 0000 000",
			role: "manager",
		});

		const restaurant = await restaurantsRepository.create({
			managerId: manager.id,
			name: "Fake restaurant",
			description: "A fake restaurants that sells fake products",
		});

		const order = await ordersRepository.create({
			customerId: manager.id,
			restaurantId: restaurant.id,
			status: "pending",
			totalInCents: 1900,
		});

		const orderDetails = await sut.execute(order.id);

		expect(orderDetails).toEqual(
			expect.objectContaining({
				id: order.id,
			}),
		);
		expect(orderDetails.orderItems).toBeNull();
		expect(orderDetails.product).toBeNull();
		expect(orderDetails.customer).toBeNull();
	});

	it("should throw if id doesn't belong to an order", async () => {
		expect(sut.execute("some-fake-id")).rejects.toBeInstanceOf(
			ResourceNotFoundError,
		);
	});
});
