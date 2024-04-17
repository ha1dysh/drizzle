import "dotenv/config";
import { db } from "./drizzle/db";
import { asc, desc, eq, sql } from "drizzle-orm";
import { post, postCategory, user, userPreferences } from "./drizzle/schema";

async function main() {
	// const res = await db
	// 	.insert(user)
	// 	.values({
	// 		name: "John",
	// 		age: 33,
	// 		email: "john.doe@example.com",
	// 	})
	// 	.returning({
	// 		id: user.id,
	// 	})
	// 	.onConflictDoUpdate({
	// 		target: user.name,
	// 		set: { name: "triggered conflict" },
	// 	});
	//
	// await db.insert(userPreferences).values({
	// 	emailUpdates: true,
	// 	userId: "85ab18de-cb04-45bc-a3ec-4d486e80b3bf",
	// });
	//
	// await db.insert(post).values({
	// 	authorId: "85ab18de-cb04-45bc-a3ec-4d486e80b3bf",
	// 	title: "title example",
	// });
	//
	//
	// await db.insert(post).values({
	// 	title: "post-2",
	// 	authorId: "85ab18de-cb04-45bc-a3ec-4d486e80b3bf",
	// });
	//
	const res = await db.query.user.findMany({
		// orderBy: asc(user.age),
		// orderBy: (table, funcs) => funcs.asc(table.age),
		// columns: { id: false },
		// columns: { name: true, id: true },
		with: { posts: { with: { postCategories: true } } },
		// limit: 1,
		// offset: 1,
		// extras: {
		// lowerCaseName: sql<string>`lower(${user.name})`.as("lowerCaseName"),
		// },
	});
	//

	// const res = await db
	// 	.select({ id: user.id })
	// 	.from(user)
	// 	.where(eq(user.age, 25))
	// 	.leftJoin(userPreferences, eq(userPreferences.userId, user.id));

	console.log(res[0]);
}

main();
