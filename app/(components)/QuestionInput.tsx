import { useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/16/solid";
import { useQuizStore } from "../util/state";
import { motion } from "framer-motion";

export default function QuestionInput({ onSubmit }: { onSubmit?: () => void }) {
	const [value, setValue] = useState("");
	const { step } = useQuizStore();
	const { addQuestion } = useQuizStore();

	return (
		<motion.div className="flex gap-4" layout layoutId="question-input">
			<input
				type="text"
				className="w-full rounded-lg"
				placeholder={
					step === 1
						? "Start with a question..."
						: "Add a question..."
				}
				aria-label="Add a question to the cloze test."
				maxLength={200}
				autoFocus
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onKeyDown={(e) => {
					if (value.trim().length === 0) {
						return;
					}

					if (e.key === "Enter") {
						e.preventDefault();
						addQuestion(value.trim().substring(0, 200));
						setValue("");
						onSubmit?.();
					}
				}}
			/>

			<button
				onClick={(e) => {
					e.preventDefault();

					if (value.trim().length === 0) {
						return;
					}

					addQuestion(value.trim().substring(0, 200));
					setValue("");
					onSubmit?.();
				}}
				className="text-white bg-purple-600 rounded-lg px-3.5"
			>
				<ArrowRightIcon className="size-4" />
			</button>
		</motion.div>
	);
}
