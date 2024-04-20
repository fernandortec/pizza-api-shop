import { describe, expect, it } from "bun:test";
import { authenticateManager } from "@/helpers/test/authenticate-manager";
import { type App, app as httpApp } from "@/http/app";
import { treaty } from "@elysiajs/eden";

describe("Get profile (e2e)", () => {
	const app = treaty(httpApp);

	it("should be able to get profile", async () => {
		const { token } = await authenticateManager();

		const response = await app.me.get({ headers: { Authorization: token } });

		expect(response.status).toBe(200);
		expect(response.data).toEqual(
			expect.objectContaining({ email: "johndoe@email.com" }),
		);
	});
});
