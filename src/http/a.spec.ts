import { describe, it } from "bun:test";
import { type App, app } from "@/http/app";
import { treaty } from "@elysiajs/eden";

describe("a", () => {
	it("hello", async () => {
		const api = treaty<App>(app);

		const user = await api.account.post({
			email: "email@email.com",
			managerName: "fake manager",
			phone: "31993750285",
			restaurantName: "restaurant",
		});

		console.log(user)

		// const { data } = await api.me.get();
		// expect(data).toBe(expect.any(Object));
	});
});
