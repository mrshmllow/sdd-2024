import { ArrowDownOnSquareStackIcon } from "@heroicons/react/24/solid";
import { useQuizStore } from "../util/state";
import { ComponentProps, ReactNode, useState } from "react";
import { showOpenFilePicker } from "file-system-access";
import QuestionInput from "../(components)/QuestionInput";
import {
	Description,
	Dialog,
	DialogPanel,
	DialogTitle,
} from "@headlessui/react";
import { motion } from "framer-motion";

function Button({
	icon,
	subtitle,
	title,
	...props
}: ComponentProps<"button"> & {
	icon: ReactNode;
	subtitle?: string;
	title: string;
}) {
	return (
		<button
			className="bg-gray-400 border border-gray-500 rounded-2xl flex flex-row items-center py-4 px-4 gap-6 group hover:border-purple-500 hover:bg-purple-400 transition-colors w-full"
			{...props}
		>
			<div className="bg-gray-500 rounded-full w-fit p-2 group-hover:bg-purple-500 transition-colors">
				<div className="size-8 text-gray-800 group-hover:text-purple-800 transition-colors">
					{icon}
				</div>
			</div>

			<p className="flex flex-col group-hover:text-purple-900 transition-colors">
				<span>{title}</span>

				{subtitle ? (
					<span className="text-sm text-gray-800 group-hover:text-purple-800 text-left transition-colors">
						{subtitle}
					</span>
				) : (
					<></>
				)}
			</p>
		</button>
	);
}

export default function One() {
	const { addQuestions, incrementStep, setTitle } = useQuizStore();
	const [loading, setLoading] = useState(false);

	return (
		<div className="my-auto gap-4 flex flex-col">
			<div>
				<h1 className="text-lg text-center">Cloze Quiz Creator</h1>

				<p className="text-center text-gray-800 text-sm">
					Create, share, and print your own cloze quiz.
				</p>
			</div>

			<div className="rounded-2xl border border-gray-500 bg-gray-400 py-4 px-4">
				<QuestionInput onSubmit={incrementStep} />
			</div>

			{loading && (
				<Dialog
					open={loading}
					static
					onClose={() => {}}
					className="relative z-50"
				>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/30"
					/>

					<div className="fixed inset-0 flex w-screen items-center justify-center p-4">
						<DialogPanel
							className="max-w-lg space-y-4 border-2 border-gray-500 bg-white p-5 w-full rounded-2xl shadow-xl relative"
							as={motion.div}
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
						>
							<DialogTitle className="font-bold text-xl text-center">
								Loading...
							</DialogTitle>

							<Description className="text-center">
								Depending on the size of the file you uploaded,
								this may take a few seconds.
							</Description>
						</DialogPanel>
					</div>
				</Dialog>
			)}

			<div className="">
				<Button
					icon={<ArrowDownOnSquareStackIcon />}
					onClick={async (e) => {
						e.preventDefault();

						const [file] = await showOpenFilePicker({
							types: [
								{
									description: "Cloze Files",
									accept: {
										"text/plain": [".txt"],
									},
								},
							],
							excludeAcceptAllOption: true,
							multiple: false,
						});

						setLoading(true);

						const data = await file.getFile();
						const text = await data.text();
						if (data.name.endsWith(".txt")) {
							const split = text
								.split("\n")
								.map((string) =>
									string.trim().substring(0, 200),
								)
								.filter((string) => string.length > 0);

							setTitle(file.name);
							addQuestions(split);
							incrementStep();
						}
					}}
					title="Import from file"
					subtitle="Supported: .txt"
				/>
			</div>
		</div>
	);
}
