"use server";

import { eq } from "drizzle-orm";
import { db } from "../db";
import { PrinterIcon } from "@heroicons/react/24/outline";
import {
	QuestionSelect,
	QuizSelect,
	TokenSelect,
	questions,
	quizzes,
	tokens,
} from "../schema";
import generateWordList from "../util/wordList";
import Print from "../(components)/Print";
import PrintButton from "./PrintButton";
import InteractiveQuiz from "../(components)/InteractiveQuiz";
import ShareButton from "./ShareButton";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Quiz({ params }: { params: { quizz: number } }) {
	const rows = await db
		.select()
		.from(quizzes)
		.leftJoin(questions, eq(quizzes.id, questions.quizzId))
		.leftJoin(tokens, eq(questions.id, tokens.questionId))
		.where(eq(quizzes.id, params.quizz));

	const result = rows.reduce<
		Record<
			number,
			{
				quiz: QuizSelect;
				questions: Record<
					number,
					QuestionSelect & {
						tokens: Array<TokenSelect>;
						order: number;
					}
				>;
			}
		>
	>((acc, row) => {
		const quiz = row.quizzes;
		const question = row.questions;
		const token = row.tokens;

		if (!acc[quiz.id]) {
			acc[quiz.id] = { quiz, questions: [] };
		}

		if (question && !acc[quiz.id].questions[question.id]) {
			acc[quiz.id].questions[question.id] = {
				...question,
				tokens: [],
				order: 0,
			};
		}

		if (
			token &&
			!acc[quiz.id].questions[token.questionId].tokens.find(
				(t) => t.id === token.id,
			)
		) {
			acc[quiz.id].questions[token.questionId].tokens.push(token);
		}

		return acc;
	}, {})[params.quizz];

	if (!result) {
		notFound();
	}

	const wordBank = generateWordList(
		Object.entries(result.questions).map(([id, question]) => question),
	);

	return (
		<main className="mx-auto max-w-3xl h-screen grid place-items-center px-4">
			<section className="relative flex flex-col gap-4 w-full h-full print:hidden mt-10">
				<div className="flex gap-2 my-5">
					<PrintButton />
					<ShareButton />
				</div>

				<InteractiveQuiz
					quiz={result.quiz}
					questions={result.questions}
				/>

				<Link href="/" className="underline text-center">
					Make my own quiz
				</Link>
			</section>

			<section className="relative flex-col gap-4 w-full h-full hidden print:flex">
				<Print
					quiz={result.quiz}
					questions={result.questions}
					wordBank={wordBank}
				/>
			</section>
		</main>
	);
}
