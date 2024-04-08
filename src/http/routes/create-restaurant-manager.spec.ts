import { describe, expect, it } from "bun:test";
import { type App, app as httpApp } from "@/http/app";
import { treaty } from "@elysiajs/eden";

describe("Create Restaurant Manager (e2e)", () => {
	const app = treaty<App>(httpApp);

	it("should be able to create a restaurant manager", async () => {
		const userResponse = await app.account.post({
			email: "email@email.com",
			managerName: "fake manager",
			phone: "31993750285",
			restaurantName: "restaurant",
		});

		expect(userResponse.status).toBe(200);
		expect(userResponse.data).toEqual(
			expect.objectContaining({ email: "email@email.com" }),
		);
	});
});
