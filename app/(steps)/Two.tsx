import { ArrowRightIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
	ArrowDownIcon,
	ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import { useQuizStore } from "../util/state";
import Question from "../(components)/Question";
import QuestionInput from "../(components)/QuestionInput";
import { LayoutGroup, motion } from "framer-motion";

export default function Two() {
	const { questions, step, clear, incrementStep, _tutorial_state } =
		useQuizStore();

	return (
		<>
			<div className="flex justify-between py-4 sticky top-0 bg-white z-20">
				<button
					className="hover:bg-gray-500 bg-gray-400 rounded-lg px-4 py-2 flex gap-2"
					onClick={(e) => {
						e.preventDefault();
						clear();
					}}
				>
					<TrashIcon className="size-6" />

					<span>Clear</span>
				</button>

				<p className="flex place-self-center">Step {step} / 3</p>

				<div className="flex place-self-end">
					<button
						className="hover:bg-gray-500 bg-gray-400 rounded-lg px-4 py-2 flex gap-2"
						disabled={
							questions.length === 0 || questions.length > 50
						}
						onClick={(e) => {
							e.preventDefault();
							incrementStep();
						}}
					>
						<span>Publish</span>

						<ArrowRightIcon className="size-6" />
					</button>
				</div>
			</div>

			{questions.length > 50 && (
				<p className="text-md text-yellow-700 flex flex-row justify-center gap-2 py-4">
					<ExclamationTriangleIcon className="size-6" />
					<span>
						Thats a lot of questions! Performance may be degraded!
						You cannot upload a quiz with more than 50 questions.
					</span>
				</p>
			)}

			{questions.length !== 0 && !_tutorial_state.has_hidden_word && (
				<motion.div
					className="flex gap-2 pl-40"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1 }}
				>
					<ArrowDownIcon className="size-6 animate-bounce" />
					<p>Click words to hide them</p>
				</motion.div>
			)}

			<ol className="flex flex-col mb-20">
				<LayoutGroup>
					{questions
						.sort((a, b) => a.order - b.order)
						.map((question) => (
							<Question question={question} key={question.id} />
						))}
				</LayoutGroup>
			</ol>

			<div className="fixed bottom-0 w-full left-0 bg-white">
				<div className="max-w-3xl pt-2 pb-4 mx-auto">
					<QuestionInput
						onSubmit={() =>
							setTimeout(
								() =>
									window.scrollTo({
										left: 0,
										top: document.body.scrollHeight,
										behavior: "smooth",
									}),
								200,
							)
						}
					/>
				</div>
			</div>
		</>
	);
}
