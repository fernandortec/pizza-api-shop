import { describe, expect, it } from "bun:test";
import { env } from "@/env";
import { authenticateManager } from "@/helpers/test/authenticate-manager";
import { type App, app as httpApp } from "@/http/app";
import { treaty } from "@elysiajs/eden";

describe("Send auth link (e2e)", () => {
	const app = treaty<App>(httpApp);

	it.if(env.NODE_ENV === "qa")("should be able to send auth link", async () => {
		const { token } = await authenticateManager();

		const response = await app["auth-links"].send.post(
			{ email: "johndoe@email.com" },
			{ headers: { Authorization: token } },
		);

		expect(response.status).toBe(200);
		expect(response.data).toEqual(
			expect.stringContaining("https://ethereal.email/message"),
		);
	});
});
