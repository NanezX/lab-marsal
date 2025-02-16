export type ExamParameterSaved = {
	name: string;
	type: 'text' | 'number'; // or "number"
	category?: string;
	unit: string;
	value: string | number;
};

export type ExamParemeterInput = {
	name: string;
	type: 'text'; // | "number";
	category?: string;
	unit: string;
	value: string; // | number
};

export type ParameterData = {
	position: number;
	parameter: ExamParemeterInput;
};
