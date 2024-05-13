"use server";

import { db } from "../db";
import {
	QuestionInsert,
	TokenInsert,
	questions,
	quizzes,
	tokens,
} from "../schema";

type AddQuizz = {
	title: string;
	questions: Array<
		QuestionInsert & {
			tokens: Array<TokenInsert>;
		}
	>;
};

export async function addQuiz(quiz: AddQuizz) {
	if (quiz.questions.length > 50) {
		return;
	}

	return await db.transaction(async (tx) => {
		const returnedQuiz = await tx
			.insert(quizzes)
			.values({ title: quiz.title })
			.returning({ id: quizzes.id })
			.then((returned) => returned[0]);

		for (const question of quiz.questions) {
			const returnedQuestion = await tx
				.insert(questions)
				.values({
					...question,
					quizzId: returnedQuiz.id,
					source: question.source,
					id: undefined,
				})
				.returning({ id: questions.id })
				.then((returned) => returned[0]);

			for (const token of question.tokens) {
				await tx.insert(tokens).values({
					...token,
					questionId: returnedQuestion.id,
					id: undefined,
				});
			}
		}

		return returnedQuiz;
	});
}
