import { describe, expect, it } from "bun:test";
import { authenticateManager } from "@/helpers/test/authenticate-manager";
import { type App, app as httpApp } from "@/http/app";
import { treaty } from "@elysiajs/eden";

describe("Create order (e2e)", () => {
	const app = treaty<App>(httpApp);

	it("should be able to approve an order", async () => {
		const { token, restaurantId } = await authenticateManager('withRestaurant');

		const order = await app["create-order"].post(
			{
				status: "pending",
				totalInCents: 1900,
				restaurantId: String(restaurantId),
			},
			{ headers: { Authorization: token } },
		);

		const response = await app["approve-order"]({
			orderId: order.data!.id,
		}).patch({}, { headers: { Authorization: token } });

		expect(response.status).toBe(200);
		expect(response.data).toEqual(
			expect.objectContaining({
				status: "processing",
				restaurantId: restaurantId,
			}),
		);
	});
});
