"use server";

import OpenAI from "openai";
import { cache } from "react";
import { Question } from "../types";

const openai = new OpenAI({});

export const getItem = cache(async (question: Question) => {
	const num = Math.floor(Math.random() * (4 - 1) + 1);

	const chatCompletion = await openai.chat.completions.create({
		messages: [
			{
				role: "system",
				content: `Pick ${num} of the most appropriate words in the following question to hide within a cloze test in JSON.`,
			},
			{
				role: "user",
				content: JSON.stringify({
					full_sentence: question.source,
					tokens: question.tokens.map((item) => ({
						value: item.value,
						id: item.id,
						important: item.important,
					})),
				}),
			},
		],
		model: "gpt-4o",
		tools: [
			{
				type: "function",
				function: {
					name: "pick_good_words",
					description:
						"Sets appropriate words for cloze question. Can only be ran 1-2 times.",
					parameters: {
						type: "object",
						properties: {
							value: {
								type: "string",
								enum: question.tokens
									.filter((token) => token.important)
									.map((token) => token.value),
							},
							id: {
								type: "number",
							},
						},
						required: ["value", "id"],
					},
				},
			},
		],
	});

	let choice = chatCompletion.choices[0];

	if (choice.finish_reason !== "tool_calls" || !choice.message.tool_calls) {
		return;
	}

	return choice.message.tool_calls.map(
		(call) =>
			JSON.parse(call.function.arguments) as {
				id: number;
				value: string;
			},
	);
});
