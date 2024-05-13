import { useQuizStore } from "../util/state";
import { addQuiz } from "../util/update";
import {
	SquaresPlusIcon,
	StopIcon,
	LightBulbIcon,
	ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState } from "react";

const pluralize = (count: number, noun: string, suffix = "s") =>
	`${count} ${noun}${count !== 1 ? suffix : ""}`;

export default function Three() {
	const { questions, title, backStep, setTitle, burn } = useQuizStore();
	const { push } = useRouter();
	const [loading, setLoading] = useState(false);

	return (
		<>
			<div className="print:hidden flex flex-col gap-4 my-auto">
				<input
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="Give this quiz a title"
					className="text-3xl w-full border-t-0 border-x-0 ring-0 col-span-2"
				/>

				<div className="text-lg flex gap-4 justify-center text-gray-800">
					<span className="flex gap-2">
						<LightBulbIcon className="size-6" />{" "}
						{pluralize(questions.length, "question")}
					</span>

					<span className="flex gap-2">
						<StopIcon className="size-6" />{" "}
						{pluralize(
							questions.reduce(
								(acc, question) =>
									acc +
									question.tokens.reduce(
										(acc, token) =>
											acc + (token.hidden ? 1 : 0),
										0,
									),
								0,
							),
							"word",
						)}{" "}
						hidden
					</span>
				</div>

				<button
					onClick={async (e) => {
						e.preventDefault();
						setLoading(true);

						let value = await addQuiz({
							title,
							questions: questions,
						});

						if (value) {
							push(`/${value.id}/`);

							burn();
						}
					}}
					className="flex items-center justify-center py-4 bg-purple-600 rounded-lg hover:bg-purple-700 text-white gap-4 transition-colors col-span-2 disabled:hover:bg-purple-600 disabled:cursor-wait"
					disabled={loading}
				>
					<SquaresPlusIcon className="size-6" />

					<span>
						{loading ? "Creating... Wait a moment..." : "Create"}
					</span>
				</button>

				<button
					onClick={async (e) => {
						e.preventDefault();
						backStep();
					}}
					className="flex items-center justify-center py-4 bg-gray-400 rounded-lg hover:bg-gray-500 gap-4 transition-colors col-span-2 disabled:cursor-wait"
					disabled={loading}
				>
					<ArrowLeftIcon className="size-6" />

					<span>Im not done yet!</span>
				</button>

				<p className="text-center">
					Publish your quiz to share and print.
				</p>
			</div>
		</>
	);
}
