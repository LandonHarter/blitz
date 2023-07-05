'use client'

import { pushGameEvent, startGame, deleteGame, subscribeToGame, GameEvent } from '@/backend/live/game';
import { GameUser } from '@/backend/live/user';
import { Question, QuestionOption, QuestionType } from '@/backend/live/set';
import { useEffect, useState } from 'react';

import styles from './host.module.css';
import { collection, doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/backend/firebase/init';
import { EventType } from '@/backend/live/events/event';
import generateId from '@/backend/id';
import useCurrentUser from '@/hooks/useCurrentUser';
import { useRouter } from 'next/navigation';
import PreGame from './pre-game/pregame';

export default function HostDashboard(props: { gameId: string, setId: string, gameStarted: boolean }) {
    const router = useRouter();

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

    const [players, setPlayers] = useState<GameUser[]>([]);
    const [numAnswers, setNumAnswers] = useState<number>(0);

    const { currentUser, signedIn, userLoading } = useCurrentUser();

    const [error, setError] = useState({
        error: false,
        message: ''
    });

    const onGameEvent = async (event:GameEvent) => {
        if (event.eventType === EventType.SubmitAnswer) {
            setNumAnswers((prevNumAnswers) => prevNumAnswers + 1);

            if (numAnswers === players.length) {
                await pushGameEvent(props.gameId, {
                    eventType: EventType.RevealAnswer,
                    eventData: {},
                    eventId: generateId()
                });
            }
        }
    };

    const onUserJoin = (user:GameUser) => {
        setPlayers((prevPlayers) => [...prevPlayers, user]);
    };

    const onUserLeave = (user:GameUser) => {
        setPlayers((prevPlayers) => prevPlayers.filter((player) => player.uid !== user.uid));
    };
    

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

            if (signedIn) {
                const owner = data.owner;
                if (owner !== currentUser.uid) {
                    router.push('/');
                    return;
                }
            }

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

            const { unsubscribeEvent, unsubscribeNewPlayer, unsubscribeLeavePlayer } = await subscribeToGame(props.gameId, onGameEvent, onUserJoin, onUserLeave);

            const unload = async () => {
                await unsubscribeEvent();
                await unsubscribeNewPlayer();
                await unsubscribeLeavePlayer();
                await pushGameEvent(props.gameId, {
                    eventType: EventType.EndGame,
                    eventData: {},
                    eventId: generateId()
                });
                await deleteGame(props.gameId);
            };
            window.onbeforeunload = unload;

            setQuestions(questionsArray);
        })();
    }, []);

    if (!props.gameStarted) {
        return(<PreGame gameId={props.gameId} users={players} start={async () => {
            if (questions.length === 0) {
                await pushGameEvent(props.gameId, {
                    eventType: EventType.EndGame,
                    eventData: {},
                    eventId: generateId()
                });
                await deleteGame(props.gameId);
                return;
            }

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
        }} end={async () => {
            await pushGameEvent(props.gameId, {
                eventType: EventType.EndGame,
                eventData: {},
                eventId: generateId()
            });
            await deleteGame(props.gameId);
            router.push('/');
        }} />);
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

                setNumAnswers(0);
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