export interface Quiz {
    id: string;
    owner: string;
    name: string;
    questions: Question[];
}

export interface Question {
    question: string;
    options: QuestionOption[];
    id: string;
}

export interface QuestionOption {
    option: string;
    correct: boolean;
    id: string;
}