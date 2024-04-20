import { auth } from "@/http/plugins/auth";
import { OrderMustBePendingError } from "@/use-cases/_errors/order-must-be-pending-error";
import { ResourceNotFoundError } from "@/use-cases/_errors/resource-not-found-error";
import { UnauthorizedError } from "@/use-cases/_errors/unauthorized-error";
import { makeDeliverOrderUseCase } from "@/use-cases/_factories/make-deliver-order-use-case";

import Elysia, { t } from "elysia";

export const deliverOrder = new Elysia()
	.error({
		RESOURCE_NOT_FOUND: ResourceNotFoundError,
		ORDER_STATUS_INVALID: OrderMustBePendingError,
	})
	.use(auth)
	.patch(
		"/deliver-order/:orderId",
		async ({ getCurrentUser, params }) => {
			const { orderId } = params;
			const { restaurantId } = await getCurrentUser();

			if (!restaurantId) throw new UnauthorizedError();

			const deliverOrderUseCase = makeDeliverOrderUseCase();

			const order = await deliverOrderUseCase.execute(orderId);

			return order;
		},
		{
			params: t.Object({ orderId: t.String() }),
			error: ({ code, set, error }) => {
				switch (code) {
					case "RESOURCE_NOT_FOUND": {
						set.status = 404;
						return { message: "Order not found" };
					}
					case "ORDER_STATUS_INVALID": {
						set.status = 400;
						return { message: error.message };
					}
				}
			},
		},
	);
