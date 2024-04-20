import { describe, expect, it } from "bun:test";
import { type App, app as httpApp } from "@/http/app";
import { treaty } from "@elysiajs/eden";
import { load } from "cheerio";
import { env } from "@/env";

describe("Authenticate from link(e2e)", () => {
	const app = treaty<App>(httpApp);

	it.if(env.NODE_ENV === "qa")("should be able to authenticate from link", async () => {
		await app["create-restaurant"].post({
			email: "email@email.com",
			managerName: "fake manager",
			phone: "31993750285",
			restaurantName: "restaurant",
		});

		const sentAuthLinkResponse = await app["auth-links"].send.post({
			email: "email@email.com",
		});

		const request = await fetch(String(sentAuthLinkResponse.data));
		const html = await request.text();

		const $ = load(html);
		const url = $("#plaintext").text();
		const code = url.match(/[?&]code=([^&#]+)/)?.[1];

		const authFromLinkResponse = await app["auth-links"].authenticate.get({
			query: { code: String(code), redirect: "http://localhost:5173" },
		});

		expect(authFromLinkResponse.status).toBe(302);
		expect(authFromLinkResponse.response?.headers.get("set-cookie")).toEqual(
			expect.any(String),
		);
		expect(authFromLinkResponse.response?.headers.get("location")).toEqual(
			expect.any(String),
		);
	});
});
