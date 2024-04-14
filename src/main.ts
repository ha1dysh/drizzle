import "dotenv/config";
import { db } from "./drizzle/db";
import { UserTable } from "./drizzle/schema";

async function main() {
	await db.insert(UserTable).values({
		name: "John",
	});

	const user = await db.query.UserTable.findFirst();
	console.log(user);
}

main();
