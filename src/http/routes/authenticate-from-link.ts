import { db } from "@/database/connection";
import { authLinks, restaurants } from "@/database/schemas";
import { auth } from "@/http/plugins/auth";
import dayjs from "dayjs";
import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";

export const authenticateFromLink = new Elysia().use(auth).get(
	"/auth-links/authenticate",
	async ({ query, jwt: { sign }, setCookie, set, signUser }) => {
		const { code, redirect } = query;

		const [authLinkFromCode] = await db
			.select()
			.from(authLinks)
			.where(eq(authLinks.code, code));

		if (!authLinkFromCode) throw new Error("Auth link not found");

		const daysSinceAuthLinkWasCreated = dayjs().diff(
			authLinkFromCode.createdAt,
			"days",
		);

		//Token must be newer than 7 days

		if (daysSinceAuthLinkWasCreated > 7) {
			throw new Error("Auth link expired, please generate a new one");
		}

		const [managedRestaurant] = await db
			.select()
			.from(restaurants)
			.where(eq(restaurants.managerId, authLinkFromCode.userId));

		//If user is a restaurant manager, save that on the cookies
		await signUser({
			sub: authLinkFromCode.userId,
			restaurantId: managedRestaurant?.id,
		});

		await db.delete(authLinks).where(eq(authLinks.code, code));

		set.redirect = redirect;
	},
	{
		query: t.Object({
			code: t.String(),
			redirect: t.String(),
		}),
	},
);
