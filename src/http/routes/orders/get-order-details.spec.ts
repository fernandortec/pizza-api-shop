import { authenticateManager } from "@/helpers/test/authenticate-manager";
import { app as httpApp } from "@/http/app";
import { treaty } from "@elysiajs/eden";
import { describe, expect, it } from "bun:test";

describe("Get order details (e2e)", () => {
	const app = treaty(httpApp);

	it("should be able to get an order's details", async () => {
		const { token, restaurantId } = await authenticateManager("withRestaurant");

		const createOrderResponse = await app["create-order"].post(
			{
				status: "pending",
				totalInCents: 1900,
				restaurantId: String(restaurantId),
			},
			{ headers: { Authorization: token } },
		);

		const getOrderResponse = await app
			.orders({
				orderId: String(createOrderResponse.data?.id),
			})
			.get({ headers: { Authorization: token } });

		expect(getOrderResponse.status).toBe(200);
		expect(getOrderResponse.data).toEqual(
			expect.objectContaining({ id: createOrderResponse.data?.id }),
		);
	});
});
