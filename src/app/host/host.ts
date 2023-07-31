import { collection, doc, getDoc } from '@firebase/firestore';
import { firestore } from '@baas/init';
import { Question, QuestionOption, QuestionType } from '@backend/set';
import { User } from '@/backend/firebase/user';
import { Unsubscribe } from 'firebase/database';
import { pushGameEvent, deleteGame } from '@/backend/live/game';
import { EventType } from '@/backend/live/events/event';
import generateId from '@/backend/id';
import { Dispatch, SetStateAction } from 'react';

export const getQuestions = async (setId: string, currentUser: User) => {
    const questionsRef = doc(collection(firestore, 'sets'), setId);
    const snapshot = await getDoc(questionsRef);

    if (!snapshot.exists()) {
        window.location.href = '/';
        return {
            questions: [],
            scramble: false,
            error: true
        };
    }

    const data = snapshot.data();

    if (!currentUser.empty) {
        const owner = data.owner;
        if (owner !== currentUser.uid) {
            window.location.href = '/';
            return {
                questions: [],
                scramble: false,
                error: true
            };
        }
    }

    const questions = data.questions;
    const numQuestions = data.numQuestions;
    const scramble = data.scramble;

    const questionsArray: Question[] = [];
    for (let i = 0; i < numQuestions; i++) {
        const question = questions[i];
        const options: QuestionOption[] = [];
        for (let j = 0; j < question.options.length; j++) {
            const option = question.options[j];
            options.push({
                id: option.id,
                option: option.option,
                correct: option.correct,
                optionData: option.optionData || {}
            });
        }

        questionsArray.push({
            id: question.id,
            question: question.question,
            type: QuestionType[question.type as keyof typeof QuestionType],
            options: options,
            photo: question.photo || '',
            scramble: question.scramble || false,
            questionLength: question.questionLength || 15,
            questionPoints: question.questionPoints || 100,
            tags: question.tags || []
        });
    }

    return {
        questions: questionsArray,
        scramble: scramble,
        error: false
    };
};

export const scrambleQuestions = (questions: Question[]) => {
    const scrambledOptionsQuestions = [...questions];
    for (let i = 0; i < scrambledOptionsQuestions.length; i++) {
        const question = scrambledOptionsQuestions[i];
        if (!question.scramble) continue;

        if (question.type === QuestionType.MultipleChoice || question.type === QuestionType.TrueFalse) {
            const scrambledOptions = [...question.options];
            for (let j = 0; j < scrambledOptions.length; j++) {
                const k = Math.floor(Math.random() * (j + 1));
                [scrambledOptions[j], scrambledOptions[k]] = [scrambledOptions[k], scrambledOptions[j]];
            }
            question.options = scrambledOptions;
        }
    }

    const scrambledQuestionsArray = [...scrambledOptionsQuestions];
    for (let i = 0; i < scrambledQuestionsArray.length; i++) {
        const j = Math.floor(Math.random() * (i + 1));
        [scrambledQuestionsArray[i], scrambledQuestionsArray[j]] = [scrambledQuestionsArray[j], scrambledQuestionsArray[i]];
    }

    return scrambledQuestionsArray;
}

export const getNextQuestionIndex = (questions: Question[], currentIndex: number, exclude: QuestionType[]) => {
    let nextId = currentIndex + 1;
    if (nextId >= questions.length) {
        return -1;
    }

    while (exclude.includes(questions[nextId].type)) {
        nextId++;
    }

    return nextId;
};

export const endGame = async (gameId: string, setGameState: Dispatch<SetStateAction<any>>) => {
    await pushGameEvent(gameId, {
        eventType: EventType.EndGame,
        eventData: {},
        eventId: generateId()
    });
    await deleteGame(gameId);

    setGameState('endgame');
};

export const generateQuestionEventData = (question: Question) => {
    return {
        questionId: question.id,
        question: question.question,
        type: question.type.toString(),
        options: question.options,
        photo: question.photo,
        points: question.questionPoints,
        tags: question.tags,
    }
}

export const unloadCallback = (gameId: string, unsubscribeEvent: Unsubscribe, unsubscribeNewPlayer: Unsubscribe, unsubscribeLeavePlayer: Unsubscribe) => {
    return async () => {
        await unsubscribeEvent();
        await unsubscribeNewPlayer();
        await unsubscribeLeavePlayer();
        await pushGameEvent(gameId, {
            eventType: EventType.EndGame,
            eventData: {},
            eventId: generateId()
        });
        await deleteGame(gameId);
    };
};