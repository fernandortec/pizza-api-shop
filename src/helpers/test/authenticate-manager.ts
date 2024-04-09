import { createAndRetrieveUser } from "@/helpers/test/create-and-retrieve-user";
import { type App, app as httpApp } from "@/http/app";
import { auth } from "@/http/plugins/auth";
import { treaty } from "@elysiajs/eden";

export async function authenticateManager() {
	const user = createAndRetrieveUser();
  const token = await sign
}
