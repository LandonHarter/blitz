import generateId from "../id";

export interface Set {
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
    TrueFalse = "TrueFalse",
}

export const emptyQuestion: Question = {
    question: "",
    type: QuestionType.MultipleChoice,
    options: [],
    id: "",
}

export const emptyMultipleChoiceQuestion = () => {
    return {
        question: "",
        type: QuestionType.MultipleChoice,
        options: [
            {
                option: "",
                correct: false,
                id: generateId(),
            },
            {
                option: "",
                correct: false,
                id: generateId(),
            },
            {
                option: "",
                correct: false,
                id: generateId(),
            },
            {
                option: "",
                correct: false,
                id: generateId(),
            },
        ],
        id: generateId(),
    }
}

export const emptyTrueFalseQuestion = () => {
    return {
        question: "",
        type: QuestionType.TrueFalse,
        options: [
            {
                option: "True",
                correct: false,
                id: generateId(),
            },
            {
                option: "False",
                correct: false,
                id: generateId(),
            },
        ],
        id: generateId(),
    }
}