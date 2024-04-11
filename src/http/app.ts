import { auth } from "@/http/plugins/auth";
import { authenticateFromLink } from "@/http/routes/auth-links/authenticate-from-link";
import { createOrder } from "@/http/routes/orders/create-order";
import { CreateRestaurantAndManager } from "@/http/routes/restaurants/create-restaurant-and-manager";
import { getManagedRestaurant } from "@/http/routes/restaurants/get-managed-restaurant";
import { getOrderDetails } from "@/http/routes/orders/get-order-details";
import { getProfile } from "@/http/routes/users/get-profile";
import { sendAuthLink } from "@/http/routes/auth-links/send-auth-link";

import Elysia from "elysia";

export const app = new Elysia()
	.use(auth)
	.use(CreateRestaurantAndManager)
	.use(sendAuthLink)
	.use(authenticateFromLink)
	.use(getProfile)
	.use(getManagedRestaurant)
	.use(getOrderDetails).use(createOrder)

export type App = typeof app;
