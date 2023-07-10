'use client'

import { pushGameEvent, startGame, deleteGame, subscribeToGame, GameEvent, getNumUsersInGame } from '@/backend/live/game';
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
import HostMultipleChoiceQuestion from './question/mcq/question';
import HostRevealedMultipleChoiceQuestion from './question/mcq/revealedquestion';
import HostEndGame from './end/endgame';
import HostWaiting from './waiting/waiting';
import HostTrueFalseQuestion from './question/tf/question';
import HostRevealedTrueFalseQuestion from './question/tf/revealedquestion';

export default function HostDashboard(props: { gameId: string, setId: string }) {
    const router = useRouter();

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1);
    const [revealedQuestion, setRevealedQuestion] = useState<boolean>(false);

    const [players, setPlayers] = useState<GameUser[]>([]);
    const [numPlayers, setNumPlayers] = useState<number>(0);
    const [playersCopy, setPlayersCopy] = useState<GameUser[]>([]);
    const [numAnswers, setNumAnswers] = useState<number>(0);

    const [resetTimer, setResetTimer] = useState<boolean>(false);

    const [gameState, setGameState] = useState<string>('pregame');

    const { currentUser, signedIn, userLoading } = useCurrentUser();
    const onGameEvent = async (event: GameEvent) => {
        if (event.eventType === EventType.SubmitAnswer) {
            const newNumAnswers = numAnswers + 1;

            if (newNumAnswers >= numPlayers) {
                await pushGameEvent(props.gameId, {
                    eventType: EventType.RevealAnswer,
                    eventData: {},
                    eventId: generateId()
                });
                setRevealedQuestion(true);
                setNumAnswers(0);
                setResetTimer(true);

                return;
            }

            setNumAnswers((prevNumAnswers) => prevNumAnswers + 1);
        } else if (event.eventType === EventType.StartGame) {
            setGameState('livegame-waiting');
            const numUsers = await getNumUsersInGame(props.gameId);
            setResetTimer(true);
            setNumPlayers(numUsers);
        } else if (event.eventType === EventType.EndGame) {
            setGameState('endgame');
            window.onbeforeunload = null;
        } else if (event.eventType === EventType.NextQuestion) {
            setGameState('livegame');
        }
    };

    const onUserJoin = (user: GameUser) => {
        setPlayers((prevPlayers) => [...prevPlayers, user]);
    };

    const onUserLeave = (user: GameUser) => {
        setPlayers((prevPlayers) => prevPlayers.filter((player) => player.uid !== user.uid));
    };

    const getQuestionUI = () => {
        const question = questions[currentQuestionIndex];
        const revealAnswerCallback = async () => {
            await pushGameEvent(props.gameId, {
                eventType: EventType.RevealAnswer,
                eventData: {},
                eventId: generateId()
            });
            setRevealedQuestion(true);
            const numUsers = await getNumUsersInGame(props.gameId);
            setNumPlayers(numUsers);
        };

        if (question.type === QuestionType.MultipleChoice) {
            return (<HostMultipleChoiceQuestion question={questions[currentQuestionIndex]} revealAnswer={revealAnswerCallback} />);
        } else if (question.type === QuestionType.TrueFalse) {
            return (<HostTrueFalseQuestion question={questions[currentQuestionIndex]} revealAnswer={revealAnswerCallback} />);
        }

        return (<></>);
    };

    const getRevealedQuestionUI = () => {
        const question = questions[currentQuestionIndex];
        const nextQuestionCallback = async () => {
            const nextQuestionIndex = currentQuestionIndex + 1;
            if (nextQuestionIndex >= questions.length) {
                await pushGameEvent(props.gameId, {
                    eventType: EventType.EndGame,
                    eventData: {},
                    eventId: generateId()
                });
                setGameState('endgame');
                return;
            }

            setNumAnswers(0);
            setRevealedQuestion(false);
            setGameState('livegame-waiting');
            await pushGameEvent(props.gameId, {
                eventType: EventType.InbetweenQuestions,
                eventData: {},
                eventId: generateId()
            });
        };

        if (question.type === QuestionType.MultipleChoice) {
            return (<HostRevealedMultipleChoiceQuestion question={questions[currentQuestionIndex]} nextQuestion={nextQuestionCallback} />);
        } else if (question.type === QuestionType.TrueFalse) {
            return (<HostRevealedTrueFalseQuestion question={questions[currentQuestionIndex]} nextQuestion={nextQuestionCallback} />);
        }

        return (<></>);
    };


    useEffect(() => {
        (async () => {
            const questionsRef = doc(collection(firestore, 'sets'), props.setId);
            const snapshot = await getDoc(questionsRef);

            if (!snapshot.exists()) {
                window.location.href = '/';
                return;
            }

            const data = snapshot.data();

            if (signedIn) {
                const owner = data.owner;
                if (owner !== currentUser.uid) {
                    window.location.href = '/';
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

    if (gameState === 'endgame') {
        return (<HostEndGame users={playersCopy} gameCode={props.gameId} />);
    } else if (gameState === 'pregame') {
        return (<PreGame gameId={props.gameId} users={players} start={async () => {
            setPlayersCopy(players);

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
        }} end={async () => {
            await pushGameEvent(props.gameId, {
                eventType: EventType.EndGame,
                eventData: {},
                eventId: generateId()
            });
            await deleteGame(props.gameId);
            window.location.href = '/';
        }} />);
    } else if (gameState === 'livegame-waiting') {
        return (<HostWaiting nextQuestion={async () => {
            const nextQuestionIndex = currentQuestionIndex + 1;
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
        }} />)
    }

    return (<>{revealedQuestion ? getRevealedQuestionUI() : getQuestionUI()}</>);
}