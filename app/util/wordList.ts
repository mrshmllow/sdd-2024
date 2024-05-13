import { Question } from "../types";

export default function generateWordList(questions: Question[]) {
	return questions
		.map((question) =>
			question.tokens
				.filter((token) => token.hidden)
				.map((value) => ({ value, random: Math.random() })),
		)
		.flat(1)
		.sort((a, b) => a.random - b.random)
		.map(({ value }) => value);
}
