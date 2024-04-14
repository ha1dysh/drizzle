import "dotenv/config";
import { db } from "./drizzle/db";
import { UserTable } from "./drizzle/schema";

async function main() {
	// await db.delete(UserTable);
	const user = await db
		.insert(UserTable)
		.values({
			name: "John",
			age: 33,
			email: "john.doe@qwe.com",
		})
		.returning({
			id: UserTable.id,
			userName: UserTable.name,
		})
		.onConflictDoUpdate({
			target: UserTable.email,
			set: { name: "Updated Name" },
		});

	console.log(user);
}

main();
