'use client'

import { pushGameEvent, startGame, deleteGame } from '@/backend/live/game';
import { Question, QuestionOption, QuestionType } from '@/backend/live/set';
import { useEffect, useState } from 'react';

import styles from './host.module.css';
import { collection, doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/backend/firebase/init';
import MCQuestion from '../live/[id]/question/mcq/question';
import { EventType } from '@/backend/live/events/event';
import generateId from '@/backend/id';

export default function HostDashboard(props: { gameId: string, setId: string, gameStarted: boolean }) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

    const [error, setError] = useState({
        error: false,
        message: ''
    });

    useEffect(() => {
        (async () => {
            const questionsRef = doc(collection(firestore, 'sets'), props.setId);
            const snapshot = await getDoc(questionsRef);

            if (!snapshot.exists()) {
                setError({
                    error: true,
                    message: 'Game does not exist'
                });
                return;
            }

            const data = snapshot.data();
            const questions = data.questions;
            const numQuestions = data.numQuestions;

            const questionsArray: Question[] = [];
            for (let i = 0; i < numQuestions; i++) {
                const question = questions[i];
                const options: QuestionOption[] = [];
                for (let j = 0; j < question.options.length; j++) {
                    const option = question.options[j];
                    options.push({
                        id: option.id,
                        option: option.option,
                        correct: option.correct
                    });
                }

                questionsArray.push({
                    id: question.id,
                    question: question.question,
                    type: QuestionType[question.type as keyof typeof QuestionType],
                    options: options
                });
            }

            setQuestions(questionsArray);
        })();
    }, []);

    if (!props.gameStarted) {
        return(
            <div>
                <button onClick={async () => {
                    await startGame(props.gameId);
                    await pushGameEvent(props.gameId, {
                        eventType: EventType.NextQuestion,
                        eventData: {
                            questionId: questions[0].id,
                            question: questions[0].question,
                            type: questions[0].type.toString(),
                            options: questions[0].options 
                        },
                        eventId: generateId()
                    });
                }} className={styles.start_button}>Start Game</button>
            </div>
        );
    }

    return(
        <div>
            <button className={styles.start_button} onClick={async () => {
                const nextQuestionIndex = currentQuestionIndex + 1;
                if (nextQuestionIndex >= questions.length) {
                    await pushGameEvent(props.gameId, {
                        eventType: EventType.EndGame,
                        eventData: {},
                        eventId: generateId()
                    });
                    await deleteGame(props.gameId);
                    return;
                }

                setCurrentQuestionIndex(nextQuestionIndex);
                await pushGameEvent(props.gameId, {
                    eventType: EventType.NextQuestion,
                    eventData: {
                        questionId: questions[nextQuestionIndex].id,
                        question: questions[nextQuestionIndex].question,
                        type: questions[nextQuestionIndex].type.toString(),
                        options: questions[nextQuestionIndex].options 
                    },
                    eventId: generateId()
                });
            }}>Next Question</button>
        </div>
    );
}