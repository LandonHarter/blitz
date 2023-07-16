import { arrayUnion, collection, doc, increment, updateDoc } from "firebase/firestore";
import { User } from "../firebase/user";
import generateId from "../id";
import { firestore } from "../firebase/init";

export interface Set {
    id: string;
    owner: string;
    name: string;
    questions: Question[];
    scramble?: boolean;
}

export interface Question {
    question: string;
    type: QuestionType;
    options: QuestionOption[];
    id: string;
    photo?: string;
    scramble?: boolean;
    questionLength?: number;
    questionPoints?: number;
}

export interface QuestionOption {
    option: string;
    correct: boolean;
    id: string;
    optionData: any;
}

export enum QuestionType {
    MultipleChoice = "MultipleChoice",
    TrueFalse = "TrueFalse",
    ShortAnswer = "ShortAnswer",
    Flashcard = "Flashcard",
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
                optionData: {}
            },
            {
                option: "",
                correct: false,
                id: generateId(),
                optionData: {}
            },
            {
                option: "",
                correct: false,
                id: generateId(),
                optionData: {}
            },
            {
                option: "",
                correct: false,
                id: generateId(),
                optionData: {}
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
                optionData: {}
            },
            {
                option: "False",
                correct: false,
                id: generateId(),
                optionData: {}
            },
        ],
        id: generateId(),
    }
}

export const emptyShortAnswerQuestion = () => {
    return {
        question: "",
        type: QuestionType.ShortAnswer,
        options: [{
            option: "",
            correct: false,
            id: generateId(),
            optionData: {
                correctAnswers: [],
            }
        }],
        id: generateId(),
    }
}

export const emptyFlashcardQuestion = () => {
    return {
        question: "",
        type: QuestionType.Flashcard,
        options: [{
            option: "",
            correct: false,
            id: generateId(),
            optionData: {
                answer: "",
            },
        }],
        id: generateId(),
    };
};

export const likeSet = async (setId: string, currentUser: User, updateUserData: () => Promise<void>) => {
    if (currentUser.empty) return;

    const userReference = doc(collection(firestore, 'users'), currentUser.uid);
    const setReference = doc(collection(firestore, 'sets'), setId);

    const likedSets = currentUser.likedSets || [];
    if (likedSets.includes(setId)) return;

    await updateDoc(setReference, {
        likes: increment(1),
    });
    await updateDoc(userReference, {
        likedSets: arrayUnion(setId),
    });

    await updateUserData();
};

export const unlikeSet = async (setId: string, currentUser: User, updateUserData: () => Promise<void>) => {
    if (currentUser.empty) return;

    const userReference = doc(collection(firestore, 'users'), currentUser.uid);
    const setReference = doc(collection(firestore, 'sets'), setId);

    const likedSets = currentUser.likedSets || [];
    if (!likedSets.includes(setId)) return;

    await updateDoc(setReference, {
        likes: increment(-1),
    });
    await updateDoc(userReference, {
        likedSets: likedSets.filter(set => set !== setId),
    });

    await updateUserData();
}