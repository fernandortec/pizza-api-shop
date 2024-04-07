import { file } from "bun";

const sqlFile = file("./drizzle/0000_plain_nemesis.sql");
const textFileContent = await sqlFile.text();
const modifiedSqlContent = textFileContent.replace(
	/\b(?:CREATE TABLE|ALTER TABLE|REFERENCES)\s+(\w+)/g,
	`$& ${"sssss"}.$1`,
);

console.log(modifiedSqlContent);