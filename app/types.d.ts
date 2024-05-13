export type Token = {
	value: string;
	hidden: boolean | null;
	important: boolean | null;
	id: number;
};

export type Question = {
	source: string;
	id: number;
	order: number;
	tokens: Array<Token>;
};
