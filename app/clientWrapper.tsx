"use client";

import { QuizStateContext, useQuizStore } from "./util/state";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

function Inner({ children }: { children: React.ReactNode }) {
	const { swapQuestions } = useQuizStore();
	return (
		<DndContext
			onDragEnd={({ active, over }) => {
				if (over !== null) {
					console.log("dropped");
					swapQuestions(Number(active.id), Number(over.id));
				}
			}}
			modifiers={[restrictToVerticalAxis]}
		>
			{children}
		</DndContext>
	);
}

export default function ClientWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<QuizStateContext.Provider value={useQuizStore}>
			<Inner>{children}</Inner>
		</QuizStateContext.Provider>
	);
}
