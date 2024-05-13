import {
	ArrowDownIcon,
	ArrowUpIcon,
	PencilIcon,
	SparklesIcon,
	TrashIcon,
} from "@heroicons/react/16/solid";
import { Question as TQuestion } from "../types";
import { useQuizStore } from "../util/state";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useMemo, useRef, useState } from "react";
import ButtonArray from "./(question)/ButtonArray";
import ArrayButton from "./(question)/ArrayButton";
import QuestionPreview from "./(question)/QuestionPreview";
import { getItem } from "../util/gpt";
import { motion } from "framer-motion";

function Droppable({ question }: { question: TQuestion }) {
	const { isOver, setNodeRef } = useDroppable({
		id: question.id,
	});

	return (
		<li
			ref={setNodeRef}
			className={`text-lg h-11 border border-gray-700 rounded-lg pr-4 py-2 relative mb-8 -z-10 ${isOver ? "bg-gray-700" : "bg-gray-800"}`}
		></li>
	);
}

export default function Question({ question }: { question: TQuestion }) {
	const {
		toggleWord,
		editQuestion,
		removeQuestion,
		swapQuestions,
		questions,
	} = useQuizStore();
	const { attributes, listeners, isDragging, setNodeRef, transform, active } =
		useDraggable({
			id: question.id,
		});
	const [editing, setEditing] = useState<boolean>(false);
	const [generating, setGenerating] = useState<boolean>(false);
	const [previous, setPrevious] = useState<string>("");
	const isLast = useMemo(
		() =>
			questions
				.sort((a, b) => a.order - b.order)
				.findIndex((quest) => quest.id === question.id) ===
			questions.length - 1,
		[questions, question],
	);
	const isFirst = useMemo(
		() =>
			questions
				.sort((a, b) => a.order - b.order)
				.findIndex((quest) => quest.id === question.id) === 0,
		[questions, question],
	);
	const style = {
		transform: CSS.Translate.toString(transform),
	};

	if (active !== null && !isDragging) {
		return <Droppable question={question} />;
	}

	return (
		<motion.div
			key={question.id}
			style={style}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ delay: 0.2 }}
		>
			<div
				className={`text-lg bg-gray-800 border border-gray-700 text-white rounded-xl shadow-lg shadow-gray-600 pr-4 py-2 relative mb-8 group flex gap-2 ${isDragging ? "z-30" : ""}`}
			>
				<div
					{...listeners}
					{...attributes}
					ref={setNodeRef}
					className="flex justify-center flex-col gap-1 px-2 pl-4 py-2"
				>
					{[...Array(3)].map((i) => (
						<div
							className="size-1.5 bg-gray-600 rounded-full"
							key={i}
						></div>
					))}
				</div>

				{!editing && (
					<p className="pb-4 break-all">
						{question.tokens.map((token) =>
							token.important ? (
								<motion.button
									key={token.id}
									className={
										token.hidden == true
											? "bg-gray-400 text-black px-2 rounded-md whitespace-pre-wrap"
											: "whitespace-pre-wrap"
									}
									onClick={() => {
										toggleWord(question, token);
									}}
								>
									{token.value}
								</motion.button>
							) : (
								<motion.span
									key={token.id}
									className="whitespace-pre-wrap"
								>
									{token.value}
								</motion.span>
							),
						)}
					</p>
				)}

				{editing && (
					<input
						className="w-full bg-transparent mb-4 rounded-lg"
						value={question.source}
						onChange={(e) => editQuestion(question, e.target.value)}
					/>
				)}

				<ButtonArray persistant={editing}>
					<ArrayButton
						label={"Auto-hide"}
						icon={<SparklesIcon />}
						disabled={generating}
						onClick={async (e) => {
							e.preventDefault();

							setGenerating(true);
							let auto = await getItem(question);

							console.log(auto);

							if (!auto) return setGenerating(false);

							auto.forEach((token) => {
								if (
									question.tokens.find(
										(cur_token) =>
											cur_token.id === token.id,
									)
								) {
									toggleWord(question, token);
								}
							});

							setGenerating(false);
						}}
					/>

					<ArrayButton
						label={"Delete"}
						icon={<TrashIcon />}
						onClick={(e) => {
							e.preventDefault();
							removeQuestion(question);
						}}
					/>

					{editing && (
						<ArrayButton
							label="Cancel"
							persistant={true}
							icon={<TrashIcon />}
							onClick={(e) => {
								e.preventDefault();
								setEditing(!editing);
								editQuestion(question, previous);
								setPrevious(question.source);
							}}
						/>
					)}

					<ArrayButton
						label={editing ? "Save Edit" : "Edit"}
						persistant={true}
						icon={<PencilIcon />}
						onClick={(e) => {
							e.preventDefault();
							setEditing(!editing);
							setPrevious(question.source);
						}}
					/>

					{!isLast && (
						<ArrayButton
							icon={<ArrowDownIcon />}
							onClick={(e) => {
								e.preventDefault();
								let me = questions
									.sort((a, b) => a.order - b.order)
									.findIndex(
										(quest) => quest.id === question.id,
									);
								swapQuestions(
									questions[me].id,
									questions[me + 1].id,
								);
							}}
						/>
					)}
					{!isFirst && (
						<ArrayButton
							icon={<ArrowUpIcon />}
							onClick={(e) => {
								e.preventDefault();
								let me = questions
									.sort((a, b) => a.order - b.order)
									.findIndex(
										(quest) => quest.id === question.id,
									);
								swapQuestions(
									questions[me].id,
									questions[me - 1].id,
								);
							}}
						/>
					)}
				</ButtonArray>
			</div>

			{!isDragging && <QuestionPreview question={question} />}
		</motion.div>
	);
}
