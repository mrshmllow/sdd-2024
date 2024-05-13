"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Question, Token } from "../types";
import { seperateIntoWords } from "./seperateIntoWords";
import { createContext } from "react";

interface QuizState {
	title: string;
	questions: Array<Question>;
	step: number;
	_global_increment: number;
	_tutorial_state: {
		has_hidden_word: boolean;
	};
	setTitle: (title: string) => void;
	incrementStep: () => void;
	backStep: () => void;
	clear: () => void;
	addQuestion: (question: string) => void;
	addQuestions: (questions: Array<string>) => void;
	removeQuestion: (question: { id: number }) => void;
	toggleWord: (question: Question, token: { id: number }) => void;
	swapQuestions: (question_one: number, question_two: number) => void;
	editQuestion: (question: Question, new_source: string) => void;
	burn: () => void;
}

const defaultValue = {
	_global_increment: 10,
	_tutorial_state: {
		has_hidden_word: false,
	},
	questions: [],
	step: 1,
	title: "",
};

export const useQuizStore = create<QuizState>()(
	devtools((set) => ({
		...defaultValue,
		burn: () => set(() => ({ ...defaultValue })),
		setTitle: (title) => set(() => ({ title })),
		clear: () => set(() => ({ questions: [] })),
		incrementStep: () =>
			set((state) => ({
				step: state.step + 1,
			})),
		backStep: () => set((state) => ({ step: state.step - 1 })),
		addQuestion: (question) =>
			set((state) => ({
				questions: [
					...state.questions,
					{
						source: question,
						id: state._global_increment + 1,
						order: state._global_increment + 1,
						tokens: seperateIntoWords(question),
					},
				],
				_global_increment: state._global_increment + 1,
			})),
		removeQuestion: ({ id }) =>
			set((state) => ({
				questions: state.questions.filter(
					(cur_quest) => cur_quest.id !== id,
				),
			})),
		addQuestions: (questions) =>
			set((state) => ({
				questions: [
					...state.questions,
					...questions
						.filter((question) => question.length !== 0)
						.map((question, i) => ({
							source: question,
							id: state._global_increment + i,
							order: state._global_increment + i,
							tokens: seperateIntoWords(question),
						})),
				],
				_global_increment: state._global_increment + questions.length,
			})),
		toggleWord: (question, token) =>
			set((state) => ({
				_tutorial_state: {
					has_hidden_word: true,
				},
				questions: state.questions.map((cur_question) => {
					if (question.id == cur_question.id) {
						return {
							...cur_question,
							tokens: cur_question.tokens.map((cur_token) => {
								if (cur_token.id == token.id)
									return {
										...cur_token,
										hidden: !cur_token.hidden,
									};
								else return cur_token;
							}),
						};
					} else return cur_question;
				}),
			})),
		swapQuestions: (question_one, question_two) =>
			set((state) => ({
				questions: state.questions.map((question) => {
					if (question.id === question_one) {
						return {
							...question,
							order: state.questions.find(
								(quest) => quest.id === question_two,
							)!.order,
						};
					}

					if (question.id === question_two) {
						return {
							...question,
							order: state.questions.find(
								(quest) => quest.id === question_one,
							)!.order,
						};
					}

					return question;
				}),
			})),
		editQuestion: (question, new_source) =>
			set((state) => ({
				questions: state.questions.map((cur_question) => {
					if (cur_question.id === question.id) {
						return {
							...question,
							source: new_source,
							tokens: seperateIntoWords(new_source),
						};
					}

					return cur_question;
				}),
			})),
	})),
);

export const QuizStateContext = createContext(useQuizStore);
