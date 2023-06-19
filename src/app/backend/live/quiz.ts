export interface Quiz {
    id: string;
    owner: string;
    name: string;
    questions: Question[];
}

export interface Question {
    question: string;
    type: QuestionType;
    options: QuestionOption[];
    id: string;
}

export interface QuestionOption {
    option: string;
    correct: boolean;
    id: string;
}

export enum QuestionType {
    MultipleChoice = "MultipleChoice",
}