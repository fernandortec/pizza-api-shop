import { auth } from "@/plugins/auth";
import { Elysia } from "elysia";

export const signOut = new Elysia()
	.use(auth)
	.post("/signOut", async ({ signOut: internalSignOut }) => {
		internalSignOut();
	});
