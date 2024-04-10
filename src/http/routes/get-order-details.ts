import { makeGetOrderDetailsUseCase } from "@/use-cases/_factories/make-get-order-details-use-case";
import Elysia, { t } from "elysia";

export const getOrderDetails = new Elysia().get(
	"/orders/:orderId",
	async ({ params }) => {
		const { orderId } = params;

		const getOrderDetailsUseCase = makeGetOrderDetailsUseCase();

		const order = await getOrderDetailsUseCase.execute(orderId);

		return order;
	},
	{
		params: t.Object({ orderId: t.String() }),
	},
);
