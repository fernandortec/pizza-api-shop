import type { Order } from "@/database/schemas";
import { auth } from "@/http/plugins/auth";
import { createOrderSchema, statusSchema } from "@/schemas/orders-schemas";
import { OrderCooldownExceededError } from "@/use-cases/_errors/order-cooldown-exceeded-error";
import { UnauthorizedError } from "@/use-cases/_errors/unauthorized-error";
import { makeCreateOrderUseCase } from "@/use-cases/_factories/make-create-order";
import Elysia, { t } from "elysia";

export const createOrder = new Elysia()
	.use(auth)
	.error({ ORDER_COOLDOWN_EXCEEDED: OrderCooldownExceededError })
	.post(
		"/create-order",
		async ({ body, getCurrentUser, params }): Promise<Order> => {
			const { userId } = await getCurrentUser();

			if (!userId) throw new UnauthorizedError();

			const { status, totalInCents, restaurantId } = body;

			const createOrderUseCase = makeCreateOrderUseCase();

			const order = await createOrderUseCase.execute({
				customerId: userId,
				restaurantId,
				status,
				totalInCents,
			});

			return order;
		},
		{
			body: t.Object({
				status: statusSchema,
				totalInCents: t.Number(),
				restaurantId: t.String(),
			}),
			error: ({ code, set, error }) => {
				switch (code) {
					case "ORDER_COOLDOWN_EXCEEDED":
						set.status = 409;
						return { message: error.message };
				}
			},
		},
	);
