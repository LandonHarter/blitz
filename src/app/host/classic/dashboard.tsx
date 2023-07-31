'use client'

import { pushGameEvent, startGame, deleteGame, subscribeToGame, GameEvent, getNumUsersInGame } from '@/backend/live/game';
import { GameUser } from '@/backend/live/user';
import { Question, QuestionOption, QuestionType } from '@/backend/set';
import { useEffect, useState } from 'react';

import { collection, doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/backend/firebase/init';
import { EventType } from '@/backend/live/events/event';
import generateId from '@/backend/id';
import useCurrentUser from '@/hooks/useCurrentUser';
import { useRouter } from 'next/navigation';
import PreGame from '../pre-game/pregame';
import HostMultipleChoiceQuestion from '../classic/mcq/question';
import HostRevealedMultipleChoiceQuestion from '../classic/mcq/revealedquestion';
import HostEndGame from '../end/endgame';
import HostWaiting from '../waiting/waiting';
import HostTrueFalseQuestion from '../classic/tf/question';
import HostRevealedTrueFalseQuestion from '../classic/tf/revealedquestion';
import HostShortAnswerQuestion from '../classic/shortanswer/question';
import HostRevealedShortAnswerQuestion from '../classic/shortanswer/revealedquestion';
import HostFlashcardQuestion from '../classic/flashcard/question';
import HostRevealedFlashcardQuestion from '../classic/flashcard/revealedquestion';
import { endGame, generateQuestionEventData, getNextQuestionIndex, getQuestions, scrambleQuestions, unloadCallback } from '../host';

export default function ClassicHostDashboard(props: { gameId: string, setId: string }) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [scrambledQuestions, setScrambledQuestions] = useState<Question[]>([]);
    const [scramble, setScramble] = useState<boolean>(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1);
    const [revealedQuestion, setRevealedQuestion] = useState<boolean>(false);

    const [players, setPlayers] = useState<GameUser[]>([]);
    const [numPlayers, setNumPlayers] = useState<number>(0);
    const [playersCopy, setPlayersCopy] = useState<GameUser[]>([]);
    const [numAnswers, setNumAnswers] = useState<number>(0);

    const [gameState, setGameState] = useState<string>('pregame');
    const { currentUser } = useCurrentUser();

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

                return;
            }

            setNumAnswers((prevNumAnswers) => prevNumAnswers + 1);
        } else if (event.eventType === EventType.StartGame) {
            setGameState('livegame-waiting');
            const numUsers = await getNumUsersInGame(props.gameId);
            setNumPlayers(numUsers);
        } else if (event.eventType === EventType.EndGame) {
            setGameState('endgame');
            window.onunload = null;
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
        const question = scramble ? scrambledQuestions[currentQuestionIndex] : questions[currentQuestionIndex];
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
            return (<HostMultipleChoiceQuestion question={question} revealAnswer={revealAnswerCallback} />);
        } else if (question.type === QuestionType.TrueFalse) {
            return (<HostTrueFalseQuestion question={question} revealAnswer={revealAnswerCallback} />);
        } else if (question.type === QuestionType.ShortAnswer) {
            return (<HostShortAnswerQuestion question={question} revealAnswer={revealAnswerCallback} />);
        } else if (question.type === QuestionType.Flashcard) {
            return (<HostFlashcardQuestion question={question} revealAnswer={revealAnswerCallback} />);
        }

        return (<></>);
    };

    const getRevealedQuestionUI = () => {
        const question = scramble ? scrambledQuestions[currentQuestionIndex] : questions[currentQuestionIndex];
        const nextQuestionCallback = async () => {
            const nextQuestionIndex = getNextQuestionIndex(questions, currentQuestionIndex, [QuestionType.Flashcard]);
            if (nextQuestionIndex === -1) {
                await endGame(props.gameId, setGameState);
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
            return (<HostRevealedMultipleChoiceQuestion question={question} nextQuestion={nextQuestionCallback} />);
        } else if (question.type === QuestionType.TrueFalse) {
            return (<HostRevealedTrueFalseQuestion question={question} nextQuestion={nextQuestionCallback} />);
        } else if (question.type === QuestionType.ShortAnswer) {
            return (<HostRevealedShortAnswerQuestion question={question} nextQuestion={nextQuestionCallback} />)
        } else if (question.type === QuestionType.Flashcard) {
            return (<HostRevealedFlashcardQuestion question={question} nextQuestion={nextQuestionCallback} />);
        }

        return (<></>);
    };

    useEffect(() => {
        (async () => {
            const {
                questions,
                scramble,
                error
            } = await getQuestions(props.setId, currentUser);
            if (error) {
                return;
            }

            setQuestions(questions);

            const scrambledQuestions = scrambleQuestions(questions);
            setScrambledQuestions(scrambledQuestions);
            setScramble(scramble);

            const { unsubscribeEvent, unsubscribeNewPlayer, unsubscribeLeavePlayer } = await subscribeToGame(props.gameId, onGameEvent, onUserJoin, onUserLeave);
            window.onbeforeunload = unloadCallback(props.gameId, unsubscribeEvent, unsubscribeNewPlayer, unsubscribeLeavePlayer);
        })();
    }, []);

    if (gameState === 'endgame') {
        return (<HostEndGame users={playersCopy} gameCode={props.gameId} />);
    } else if (gameState === 'pregame') {
        return (<PreGame gameId={props.gameId} users={players} start={async () => {
            setPlayersCopy(players);

            if (questions.length === 0) {
                await endGame(props.gameId, setGameState);
                return;
            }

            await startGame(props.gameId);
        }} end={async () => {
            await endGame(props.gameId, setGameState);
            window.location.href = '/';
        }} />);
    } else if (gameState === 'livegame-waiting') {
        return (<HostWaiting nextQuestion={async () => {
            const nextQuestionIndex = getNextQuestionIndex(questions, currentQuestionIndex, [QuestionType.Flashcard]);
            if (nextQuestionIndex === -1) {
                await endGame(props.gameId, setGameState);
                return;
            }
            setCurrentQuestionIndex(nextQuestionIndex);

            const questionsArray = scramble ? scrambledQuestions : questions;
            await pushGameEvent(props.gameId, {
                eventType: EventType.NextQuestion,
                eventData: generateQuestionEventData(questionsArray[nextQuestionIndex]),
                eventId: generateId()
            });
        }} />)
    }

    return (<>{revealedQuestion ? getRevealedQuestionUI() : getQuestionUI()}</>);
}