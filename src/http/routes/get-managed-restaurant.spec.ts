import { describe, expect, it } from "bun:test";
import { type App, app as httpApp } from "@/http/app";
import { treaty } from "@elysiajs/eden";

describe("Get Managed Restaurant (e2e)", () => {
	const app = treaty<App>(httpApp);

	it.skip("should be able to get a managed restaurant", async () => {
		await app.restaurants.post({
			email: "email@email.com",
			managerName: "fake manager",
			phone: "31993750285",
			restaurantName: "restaurant",
		});

		const authResponse = await app["auth-links"].authenticate.post({
			email: "email@email.com",
		});


		const restaurantResponse = await app.restaurants.get();

		expect(restaurantResponse.status).toBe(200);
		expect(restaurantResponse.data).toEqual(
			expect.objectContaining({ email: "email@email.com" }),
		);
	});
});
