import { QuestionSelect, QuizSelect, TokenSelect } from "../schema";
import generateWordList from "../util/wordList";
import QuestionPreview from "./(question)/QuestionPreview";

export default function Print({
	quiz,
	questions,
	wordBank,
}: {
	quiz: QuizSelect;
	questions: Record<
		number,
		QuestionSelect & {
			tokens: Array<TokenSelect>;
			order: number;
		}
	>;
	wordBank: ReturnType<typeof generateWordList>;
}) {
	return (
		<div className="prose max-w-full pt-10 print:block">
			<h1>{quiz.title ? quiz.title : "Untitled Quiz"}</h1>

			{wordBank.length > 0 && (
				<>
					<h2>Word Bank</h2>

					<ol className="grid grid-cols-3">
						{wordBank.map((token) => (
							<li key={token.id}>{token.value}</li>
						))}
					</ol>
				</>
			)}

			<h2>Questions</h2>

			{Object.entries(questions).map(([id, question]) => (
				<QuestionPreview key={id} question={question} />
			))}
		</div>
	);
}
