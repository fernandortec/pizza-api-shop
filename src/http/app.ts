import { auth } from "@/http/plugins/auth";
import { authenticateFromLink } from "@/http/routes/authenticate-from-link";
import { CreateRestaurantAndManager } from "@/http/routes/create-restaurant-manager";
import { getManagedRestaurant } from "@/http/routes/get-managed-restaurant";
import { getOrderDetails } from "@/http/routes/get-order-details";
import { getProfile } from "@/http/routes/get-profile";
import { sendAuthLink } from "@/http/routes/send-auth-link";

import Elysia from "elysia";

export const app = new Elysia()
	.use(auth)
	.use(CreateRestaurantAndManager)
	.use(sendAuthLink)
	.use(authenticateFromLink)
	.use(getProfile)
	.use(getManagedRestaurant)
	.use(getOrderDetails);

export type App = typeof app;
