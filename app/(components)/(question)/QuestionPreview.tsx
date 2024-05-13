import { Question } from "@/app/types";

export default function QuestionPreview({ question }: { question: Question }) {
	return (
		<li className="text-lg bg-gray-400 border-2 border-gray-500 px-4 shadow-gray-400 shadow-inner rounded-xl pr-4 py-2 relative mb-8 prose list-decimal list-inside min-w-full">
			{question.tokens.map((token) => (
				<span className="whitespace-pre-wrap break-all" key={token.id}>
					{token.hidden
						? "_".repeat(token.value.length * 2)
						: token.value}
				</span>
			))}
		</li>
	);
}
