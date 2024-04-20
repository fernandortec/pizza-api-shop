import { authenticateManager } from "@/helpers/test/authenticate-manager";
import { app as httpApp } from "@/http/app";
import { treaty } from "@elysiajs/eden";
import { describe, expect, it } from "bun:test";

describe("Deliver order (e2e)", () => {
	const app = treaty(httpApp);

	it("should be able to deliver an order", async () => {
		const { token, restaurantId } = await authenticateManager("withRestaurant");

		const order = await app["create-order"].post(
			{
				status: "delivering",
				totalInCents: 1900,
				restaurantId: String(restaurantId),
			},
			{ headers: { Authorization: token } },
		);

		const response = await app["deliver-order"]({
			orderId: order.data!.id,
		}).patch({}, { headers: { Authorization: token } });

		expect(response.status).toBe(200);
		expect(response.data).toEqual(
			expect.objectContaining({
				status: "delivered",
			}),
		);
	});
});
