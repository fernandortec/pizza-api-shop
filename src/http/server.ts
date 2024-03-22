import { errorHandler } from "@/http/error-handler";
import { authenticateFromLink } from "@/http/routes/authenticate-from-link";
import { createRestaurantManager } from "@/http/routes/create-restaurant-manager";
import { getManagedRestaurant } from "@/http/routes/get-managed-restaurant";
import { getProfile } from "@/http/routes/get-profile";
import { sendAuthLink } from "@/http/routes/send-auth-link";
import { signOut } from "@/http/routes/sign-out";
import { auth } from "@/plugins/auth";
import chalk from "chalk";
import { Elysia } from "elysia";

const app = new Elysia()
	.use(auth)
	.use(createRestaurantManager)
	.use(sendAuthLink)
	.use(authenticateFromLink)
	.use(signOut)
	.use(getProfile)
	.use(getManagedRestaurant)
	.onError(errorHandler);

app.listen(3333, () => {
	console.log(chalk.green.bold("HTTP server running: ✔"));
});
