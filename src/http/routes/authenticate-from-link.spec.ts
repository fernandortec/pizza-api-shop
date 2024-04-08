import { describe, expect, it } from "bun:test";
import { type App, app as httpApp } from "@/http/app";
import { treaty } from "@elysiajs/eden";

describe("Authenticate from link(e2e)", () => {
	const app = treaty<App>(httpApp);

	it("should be able to authenticate from link", async () => {
		const userResponse = await app.account.post({
			email: "email@email.com",
			managerName: "fake manager",
			phone: "31993750285",
			restaurantName: "restaurant",
		});

		const authResponse = await app.authenticate.post({
			email: "email@email.com",
		});

		expect(authResponse.status).toBe(200);
		expect(authResponse.data).toEqual(expect.any(String));
	});
});
