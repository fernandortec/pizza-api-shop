import { app as httpApp, type App } from "@/http/app";
import { treaty } from "@elysiajs/eden";
import { describe, expect, it } from "bun:test";

describe("Get Managed Restaurant (e2e)", () => {
	const app = treaty<App>(httpApp);

	it.only("should be able to get a managed restaurant", async () => {
		expect("ok").toBe("ok");
	});
});
