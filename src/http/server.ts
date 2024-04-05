import { app } from "@/http/app";
import chalk from "chalk";

app.listen(3333, () => {
	console.log(chalk.green.bold("HTTP server running: ✔"));
});
