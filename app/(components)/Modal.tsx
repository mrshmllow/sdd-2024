import {
	Description,
	Dialog,
	DialogPanel,
	DialogTitle,
} from "@headlessui/react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

export default function Modal({
	correct,
	isOpen,
	onClose,
}: {
	correct: boolean;
	isOpen: boolean;
	onClose: () => void;
}) {
	return (
		<>
			{isOpen && (
				<Dialog
					open={isOpen}
					static
					onClose={() => !correct && onClose()}
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
							className="max-w-lg space-y-4 border-2 border-gray-500 bg-white p-5 w-full rounded-2xl shadow-xl relative pt-14"
							as={motion.div}
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
						>
							<div className="w-full absolute -top-10 right-0 flex justify-center">
								<div
									className={`rounded-full w-fit p-6 transition-colors ${correct ? "bg-green-300" : "bg-red-300"}`}
								>
									<div
										className={`size-12 ${correct ? "text-green-800" : "bg-red-300"} transition-colors`}
									>
										{correct ? (
											<CheckIcon />
										) : (
											<XMarkIcon />
										)}
									</div>
								</div>
							</div>

							<DialogTitle className="font-bold text-xl text-center">
								{correct ? "Correct!" : "Incorrect!"}
							</DialogTitle>

							<Description className="text-center">
								{correct
									? "You got all the questions correct!"
									: "Maybe review your answers?"}
							</Description>

							{!correct && (
								<div className="flex gap-4">
									<button
										className="bg-black w-full text-white rounded-xl px-6 py-3"
										onClick={onClose}
									>
										Try Again
									</button>
								</div>
							)}
						</DialogPanel>
					</div>
				</Dialog>
			)}
		</>
	);
}
