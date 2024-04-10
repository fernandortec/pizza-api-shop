import { beforeEach, describe, expect, it, setSystemTime } from "bun:test";
import { InMemoryOrdersRepository } from "@/repositories/in-memory/in-memory-orders-repository";
import { InMemoryRestaurantsRepository } from "@/repositories/in-memory/in-memory-restaurants-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import type { OrdersRepository } from "@/repositories/orders-repository";
import type { RestaurantsRepository } from "@/repositories/restaurants-repository";
import type { UsersRepository } from "@/repositories/users-repository";
import { OrderCooldownExceededError } from "@/use-cases/_errors/order-cooldown-exceeded-error";
import { CreateOrderUseCase } from "@/use-cases/orders/create-order";

describe("Create order use case", () => {
	let ordersRepository: OrdersRepository;
	let usersRepository: UsersRepository;
	let restaurantsRepository: RestaurantsRepository;
	let sut: CreateOrderUseCase;

	beforeEach(() => {
		ordersRepository = new InMemoryOrdersRepository();
		usersRepository = new InMemoryUsersRepository();
		restaurantsRepository = new InMemoryRestaurantsRepository();

		sut = new CreateOrderUseCase(ordersRepository);
	});

	it("should be able to create an order", async () => {
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

		const order = await sut.execute({
			customerId: manager.id,
			restaurantId: restaurant.id,
			status: "pending",
			totalInCents: 1900,
		});

		expect(order).toEqual(
			expect.objectContaining({
				id: expect.any(String),
				customerId: manager.id,
				restaurantId: restaurant.id,
			}),
		);
	});

	it("should not be able to create two orders, one close to the other", async () => {
		setSystemTime(new Date(2024, 0, 1, 12, 0));

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

		await sut.execute({
			customerId: manager.id,
			restaurantId: restaurant.id,
			status: "pending",
			totalInCents: 1900,
		});

		expect(
			sut.execute({
				customerId: manager.id,
				restaurantId: restaurant.id,
				status: "pending",
				totalInCents: 1900,
			}),
		).rejects.toBeInstanceOf(OrderCooldownExceededError);

		setSystemTime(new Date(2024, 0, 2, 12, 0));

		const order = await sut.execute({
			customerId: manager.id,
			restaurantId: restaurant.id,
			status: "pending",
			totalInCents: 1900,
		});

		expect(order.id).toEqual(expect.any(String));
	});
});
