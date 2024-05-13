"use client";

import { QuestionSelect, QuizSelect, TokenSelect } from "../schema";
import { createContext, useContext, useMemo, useState } from "react";
import generateWordList from "../util/wordList";
import { Token } from "../types";
import Modal from "./Modal";

const tokenBankContext = createContext<{
	bank: Array<
		Token & {
			used: boolean;
			correct: boolean;
		}
	>;
	setBank: (
		bank: Array<
			Token & {
				used: boolean;
				correct: boolean;
			}
		>,
	) => void;
	shouldShowResults: boolean;
}>({
	bank: [],
	setBank: () => {},
	shouldShowResults: false,
});

export function Selector({ token }: { token: Token }) {
	const [current, setCurrent] = useState<string>("default");
	const { bank, setBank } = useContext(tokenBankContext);
	const isValid = useMemo(() => {
		const held_token = bank.find((token) => String(token.id) === current);

		return !held_token;
	}, [bank, current]);

	return (
		<select
			className={`inline-block border-2 shadow-gray-400 shadow-inner rounded-xl relative ${isValid && current !== "default" ? "border-red-500" : "border-gray-500"}`}
			required
			aria-invalid={isValid}
			value={current}
			onChange={(e) => {
				setBank([
					...bank.map((cur_token) =>
						String(cur_token.id) === current
							? { ...cur_token, used: false, correct: false }
							: String(cur_token.id) === e.target.value
								? {
										...cur_token,
										used: true,
										correct: cur_token.id === token.id,
									}
								: cur_token,
					),
				]);
				setCurrent(e.target.value);
			}}
		>
			<option value="default">
				{token.hidden
					? "_".repeat(token.value.length * 2)
					: token.value}
			</option>

			{bank.map((value) => (
				<option key={value.id} value={value.id} disabled={value.used}>
					{value.value}
				</option>
			))}
		</select>
	);
}

export default function InteractiveQuiz({
	questions,
	quiz,
}: {
	quiz: QuizSelect;
	questions: Record<
		number,
		QuestionSelect & {
			tokens: Array<TokenSelect>;
			order: number;
		}
	>;
}) {
	const [wordBank, setWordBank] = useState(
		generateWordList(
			Object.entries(questions).map(([, question]) => question),
		).map((token) => ({ ...token, used: false, correct: false })),
	);
	const [isShowingResults, setIsShowingResults] = useState(false);
	const valid = useMemo(() => {
		const invalid = wordBank.find((token) => !token.correct);

		return invalid === undefined;
	}, [wordBank]);

	return (
		<tokenBankContext.Provider
			value={{
				bank: wordBank,
				setBank: (bank) => setWordBank(bank),
				shouldShowResults: isShowingResults,
			}}
		>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					setIsShowingResults(true);
				}}
				className="prose w-full min-w-full"
			>
				<Modal
					correct={valid}
					isOpen={isShowingResults}
					onClose={() => setIsShowingResults(false)}
				/>

				<h1>{quiz.title ? quiz.title : "Untitled Quiz"}</h1>

				<h2>Word Bank</h2>

				<ol className="grid grid-cols-3 place-items-center gap-2 text-lg">
					{wordBank.map((token) => (
						<li
							key={token.id}
							className={`${wordBank.find((cur_token) => cur_token.id === token.id)?.used ? "line-through border-2 shadow-gray-500 shadow-inner" : "bg-gray-800 border-gray-800 text-white shadow-md shadow-gray-600 marker:text-gray-500"} border-2 rounded-xl py-1 px-4 text-center w-fit transition-colors list-inside`}
						>
							{token.value}
						</li>
					))}
				</ol>

				<h2>Questions</h2>

				{Object.entries(questions).map(([, question]) => (
					<li
						className="text-lg prose list-decimal list-inside min-w-full"
						key={question.id}
					>
						{question.tokens.map((token) =>
							token.hidden && token.important ? (
								<Selector token={token} key={token.id} />
							) : (
								<span
									className="whitespace-pre-wrap"
									key={token.id}
								>
									{token.value}
								</span>
							),
						)}
					</li>
				))}

				<input
					type="submit"
					value="Submit"
					className="flex items-center justify-center py-4 bg-purple-600 rounded-lg hover:bg-purple-700 gap-4 transition-colors text-white w-full my-4 cursor-pointer"
				/>
			</form>
		</tokenBankContext.Provider>
	);
}
