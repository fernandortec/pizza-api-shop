import { describe, expect, it } from "bun:test";
import { authenticateManager } from "@/helpers/test/authenticate-manager";
import { type App, app as httpApp } from "@/http/app";
import { treaty } from "@elysiajs/eden";

describe("Get Managed Restaurant (e2e)", () => {
	const app = treaty<App>(httpApp);

	it("should be able to get a managed restaurant", async () => {
		const { token } = await authenticateManager("withRestaurant");

		const response = await app.restaurants.get({
			headers: { Authorization: token },
		});

		expect(response.data).toEqual(
			expect.objectContaining({ name: "Fake Restaurant" }),
		);
	});
});
