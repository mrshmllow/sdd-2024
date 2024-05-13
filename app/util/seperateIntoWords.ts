import { Token } from "../types";

const REGEX = /[\p{L}-]+/gu;

export function seperateIntoWords(sourceString: string): Array<Token> {
	if (sourceString.length === 0) return [];

	let currentMatch = REGEX.exec(sourceString);

	if (!currentMatch) return [];

	let list: Array<Token> = [];

	// Slice the source string from index 0, to the char before the current match,
	// collecting any non-word puncuation at the beginning of the string.
	list.push({
		value: sourceString.slice(0, currentMatch.index),
		id: 0,
		important: false,
		hidden: false,
	});

	// Place the current word into the list.
	list.push({
		value: currentMatch[0],
		id: 1,
		important: true,
		hidden: false,
	});

	let previousIndex = REGEX.lastIndex;
	let _id = 2;

	// Continue looping until there are not more words matched by the regex
	while ((currentMatch = REGEX.exec(sourceString)) !== null) {
		// Slice the source string from the previous word's end char, to the char
		// before the beginning of the next word.
		list.push({
			value: sourceString.slice(previousIndex, currentMatch.index),
			id: _id,
			hidden: false,
			important: false,
		});

		list.push({
			value: currentMatch[0],
			id: _id + 1,
			important: true,
			hidden: false,
		});

		previousIndex = REGEX.lastIndex;
		_id += 2;
	}

	// Finally slice any puncuation at the end of the string that was not a word.
	list.push({
		value: sourceString.slice(previousIndex),
		id: _id,
		important: false,
		hidden: false,
	});

	// Remove any empty strings, such as random spaces that may of been collected.
	list = list.filter((value) => value.value.length !== 0);

	return list;
}
