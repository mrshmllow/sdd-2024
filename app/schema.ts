import { text, pgTable, boolean, serial } from "drizzle-orm/pg-core";

export const quizzes = pgTable("quizzes", {
	id: serial("id").primaryKey(),
	title: text("title"),
});

export const questions = pgTable("questions", {
	id: serial("id").primaryKey(),
	quizzId: serial("quizzId")
		.references(() => quizzes.id)
		.notNull(),
	source: text("source").notNull(),
});

export const tokens = pgTable("tokens", {
	id: serial("id").primaryKey(),
	questionId: serial("questionId").references(() => questions.id),
	important: boolean("important"),
	hidden: boolean("hidden"),
	value: text("value").notNull(),
});

export type QuizSelect = typeof quizzes.$inferSelect;
export type TokenSelect = typeof tokens.$inferSelect;
export type QuestionSelect = typeof questions.$inferSelect;

export type QuizInsert = typeof quizzes.$inferInsert;
export type QuestionInsert = typeof questions.$inferInsert;
export type TokenInsert = typeof tokens.$inferInsert;
