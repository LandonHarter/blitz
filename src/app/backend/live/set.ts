import { arrayUnion, collection, doc, increment, updateDoc, getDoc, arrayRemove } from "firebase/firestore";
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
    Math = "Math",
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
        questionLength: 15,
        questionPoints: 100,
        scramble: false,
    }
};

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
        questionLength: 15,
        questionPoints: 100,
        scramble: false,
    }
};

export const emptyShortAnswerQuestion = () => {
    return {
        question: "",
        type: QuestionType.ShortAnswer,
        options: [{
            option: "",
            correct: false,
            id: generateId(),
            optionData: {
                correctAnswers: [
                    ''
                ],
            }
        }],
        id: generateId(),
        questionLength: 15,
        questionPoints: 100,
        scramble: false,
    }
};

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
        questionLength: 15,
        questionPoints: 100,
        scramble: false,
    };
};

export const emptyMathQuestion = () => {
    return {
        question: "",
        type: QuestionType.Math,
        options: [{
            option: "",
            correct: false,
            id: generateId(),
            optionData: {
                correctAnswers: [''],
            },
        }],
        id: generateId(),
        questionLength: 15,
        questionPoints: 100,
        scramble: false,
    };
};

export const likeSet = async (setId: string, currentUser: User, updateUserData: () => Promise<void>) => {
    if (currentUser.empty) return;

    const userReference = doc(collection(firestore, 'users'), currentUser.uid);
    const setReference = doc(collection(firestore, 'sets'), setId);

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

    await updateDoc(setReference, {
        likes: increment(-1),
    });
    await updateDoc(userReference, {
        likedSets: arrayRemove(setId),
    });

    await updateUserData();
}

const cachedSets: { [key: string]: any } = {};
export const getSet = async (setId: string) => {
    if (cachedSets[setId]) {
        return cachedSets[setId];
    }

    const setRef = doc(collection(firestore, 'sets'), setId);
    const setData = await getDoc(setRef);

    if (!setData.exists()) {
        return null;
    }

    const set = setData.data();
    const setObj = {
        id: setData.id,
        name: set.name,
        description: set.description,
        image: set.image,
        questions: set.questions as Question[],
        likes: set.likes,
        numQuestions: set.numQuestions,
        createdAt: set.createdAt,
        updatedAt: set.updatedAt,
        public: set.public,
        owner: set.owner,
    };
    cachedSets[setId] = setObj;

    return setObj;
};