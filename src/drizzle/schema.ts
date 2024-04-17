import { relations } from "drizzle-orm";
import {
	boolean,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	real,
	timestamp,
	uniqueIndex,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const UserRole = pgEnum("userRole", ["ADMIN", "BASIC"]);

export const user = pgTable(
	"user",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: varchar("name", { length: 255 }).notNull(),
		age: integer("age").notNull(),
		email: varchar("email", { length: 255 }).notNull(),
		role: UserRole("userRole").default("BASIC").notNull(),
	},
	(table) => {
		return {
			emailIndex: uniqueIndex("emailIndex").on(table.email),
		};
	}
);

export const userPreferences = pgTable("userPreferences", {
	id: uuid("id").primaryKey().defaultRandom(),
	emailUpdates: boolean("emailUpdates").notNull().default(false),
	userId: uuid("userId")
		.references(() => user.id)
		.notNull(),
});

export const post = pgTable("post", {
	id: uuid("id").primaryKey().defaultRandom(),
	title: varchar("title", { length: 255 }).notNull(),
	averageRating: real("averageRating").notNull().default(0),
	createAt: timestamp("createAt").defaultNow().notNull(),
	updatedAt: timestamp("updatedAt").defaultNow().notNull(),
	authorId: uuid("authorId")
		.references(() => user.id)
		.notNull(),
});

export const postCategory = pgTable("postCategory", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: varchar("name", { length: 255 }).notNull(),
});

export const posts_postCategories = pgTable(
	"posts_postCategories",
	{
		postId: uuid("postId")
			.references(() => post.id)
			.notNull(),
		categoryId: uuid("categoryId")
			.references(() => postCategory.id)
			.notNull(),
	},
	(table) => {
		return {
			compositePK: primaryKey({ columns: [table.postId, table.categoryId] }),
		};
	}
);

// // RELATIONS
export const userRelations = relations(user, ({ one, many }) => {
	return {
		preferences: one(userPreferences, {
			fields: [user.id],
			references: [userPreferences.userId],
		}),
		posts: many(post),
	};
});

export const userPreferencesRelations = relations(
	userPreferences,
	({ one }) => {
		return {
			user: one(user, {
				fields: [userPreferences.userId],
				references: [user.id],
			}),
		};
	}
);

export const postRelations = relations(post, ({ one, many }) => {
	return {
		author: one(user, {
			fields: [post.authorId],
			references: [user.id],
		}),
		postCategories: many(posts_postCategories),
	};
});

export const postCategoryRelations = relations(postCategory, ({ many }) => {
	return { postCategories: many(postCategory) };
});

export const posts_postCategoriesRelations = relations(
	posts_postCategories,
	({ one }) => {
		return {
			post: one(post, {
				fields: [posts_postCategories.postId],
				references: [post.id],
			}),
			category: one(postCategory, {
				fields: [posts_postCategories.categoryId],
				references: [postCategory.id],
			}),
		};
	}
);
