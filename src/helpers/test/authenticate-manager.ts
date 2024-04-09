import { createAndRetrieveCode } from "@/helpers/test/create-and-retrieve-code";
import { app as httpApp } from "@/http/app";
import { treaty } from "@elysiajs/eden";

interface AuthenticateManagerResponse {
	token: string;
}

type AuthenticateManagerParams = "withRestaurant" | null;

export async function authenticateManager(
	relationship: AuthenticateManagerParams = null,
): Promise<AuthenticateManagerResponse> {
	const app = treaty(httpApp);
	const { code } = await createAndRetrieveCode(relationship);

	const authFromLinkResponse = await app["auth-links"].authenticate.get({
		query: { code, redirect: "http://localhost:5173" },
	});

	const fullToken = authFromLinkResponse.response?.headers.get("set-cookie");
	const token = fullToken?.match(/auth=([^;]+)/)?.[1];

	return { token: String(token) };
}
