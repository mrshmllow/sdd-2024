"use client";

import { useQuizStore } from "./util/state";
import One from "./(steps)/One";
import Two from "./(steps)/Two";
import Three from "./(steps)/Three";

export default function Home() {
	const { step } = useQuizStore();

	return (
		<main className="mx-auto max-w-3xl h-screen grid place-items-center px-4">
			<section className="relative flex flex-col gap-4 w-full h-full">
				{step === 1 ? (
					<One />
				) : step === 2 ? (
					<Two />
				) : step === 3 ? (
					<Three />
				) : (
					<></>
				)}
			</section>
		</main>
	);
}
