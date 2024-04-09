import { app } from "@/http/app";
import chalk from "chalk";

app.listen(3333, () => {
	console.log(
		chalk.green.bold(
			`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
		),
	);
});
