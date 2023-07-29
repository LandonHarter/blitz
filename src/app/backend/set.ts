import { arrayUnion, collection, doc, increment, updateDoc, getDoc, arrayRemove, serverTimestamp, setDoc, Timestamp } from "firebase/firestore";
import { User } from "./firebase/user";
import generateId from "./id";
import { firestore } from "./firebase/init";

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
    tags?: string[];
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

    const set = await getSet(setId);
    const setObj = {
        name: set.name,
        description: set.description,
        image: set.image,
    };
    const likedSets = currentUser.likedSets ? { ...currentUser.likedSets, [setId]: setObj } : { [setId]: setObj };
    await updateDoc(userReference, {
        likedSets: likedSets,
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

    const likedSets = currentUser.likedSets;
    delete likedSets[setId];
    await updateDoc(userReference, {
        likedSets: likedSets,
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

export const duplicateSet = async (setId: string, currentUser: User, updateUserData: () => Promise<void>) => {
    const setData = await getSet(setId);
    if (!setData) return null;

    const newSetRef = doc(collection(firestore, 'sets'));
    const userRef = doc(collection(firestore, 'users'), currentUser.uid);

    await setDoc(newSetRef, {
        id: newSetRef.id,
        name: setData.name,
        questions: setData.questions,
        numQuestions: setData.numQuestions,
        settings: {},
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        owner: currentUser.uid,
        ownerName: currentUser.name,
        public: true,
        likes: 0,
        image: setData.image,
        description: setData.description
    });

    await updateDoc(userRef, {
        sets: arrayUnion({
            id: newSetRef.id,
            name: setData.name,
            description: setData.description,
            image: setData.image,
            updatedAt: Timestamp.now(),
        })
    });

    await updateDoc(doc(collection(firestore, 'site'), 'metrics'), {
        numSets: increment(1)
    });

    await updateUserData();
    return newSetRef.id;
};