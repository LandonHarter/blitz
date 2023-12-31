'use client'

import { usePathname } from "next/navigation";
import useCurrentUser from "@hooks/useCurrentUser";
import Loading from "@components/loading/loading";
import { useEffect, useState } from "react";
import { get, ref } from "firebase/database";
import { realtimeDb } from "@baas/init";

import styles from './page.module.css';
import { GameUser } from "@/backend/live/user";
import { GameEvent, getGameData, leaveGame, subscribeToGame } from "@/backend/live/game";
import { EventType } from "@/backend/live/events/event";
import MCQuestion from "./mcq/question";
import { Question, QuestionType } from "@/backend/set";
import Waiting from "../waiting/waiting";
import NeedSignin from "@/components/require-signin/needsignin";
import GameLobby from "../lobby/lobby";
import GameEnded from "../game-ended/ended";
import NotInGame from "../not-in-game/notingame";
import ClientWaiting from "../waiting/startgamewait";
import { getRandomSubmittedAnswerPhrase } from "@/backend/phrase";
import TFQuestion from "./tf/question";
import ShortAnswerQuestion from "./shortanswer/question";
import FlashcardQuestion from "./flashcard/question";
import { CorrectAnswerContext } from "../correctanswercontext";
import { createSession } from "@/backend/analyze";
import { initClient, unloadCallback } from "../client";

export default function ClientClassicGame() {
    const id = usePathname().split('/')[2];

    const [inGame, setInGame] = useState(false);
    const { currentUser, signedIn, userLoading } = useCurrentUser();

    const [loadingData, setLoadingData] = useState(true);

    const [gameState, setGameState] = useState<string>('pregame');
    const [currentQuestion, setCurrentQuestion] = useState<Question>();
    const [submittedAnswer, setSubmittedAnswer] = useState<boolean>(false);
    const [revealAnswer, setRevealAnswer] = useState<boolean>(false);

    const [correctAnswer, setCorrectAnswer] = useState<boolean>(false);

    const onGameEvent = (event: GameEvent) => {
        if (event.eventType === EventType.StartGame) {
            setGameState('livegame-waiting');
        } else if (event.eventType === EventType.NextQuestion) {
            setGameState('livegame');
            setSubmittedAnswer(false);
            setRevealAnswer(false);
            setCorrectAnswer(false);
            setCurrentQuestion({
                id: event.eventData.questionId,
                question: event.eventData.question,
                type: QuestionType[event.eventData.type as keyof typeof QuestionType],
                options: event.eventData.options,
                photo: event.eventData.photo,
                questionPoints: event.eventData.points || 100,
                tags: event.eventData.tags,
            });
        } else if (event.eventType === EventType.RevealAnswer) {
            setRevealAnswer(true);
        } else if (event.eventType === EventType.EndGame) {
            setGameState('endgame');
            // @ts-ignore
            window.onunload.call(null);
            window.onunload = null;
        } else if (event.eventType === EventType.KickPlayer) {
            if (currentUser?.uid === event.eventData.uid) {
                const unload = window.onunload;
                if (unload) {
                    // @ts-ignore
                    unload.call(null);

                    window.onunload = null;
                }
                window.location.href = '/join';
            }
        } else if (event.eventType === EventType.InbetweenQuestions) {
            setGameState('livegame-waiting');
        }
    };

    const onUserJoin = (user: GameUser) => { };

    const onUserLeave = (user: GameUser) => { };

    const getQuestionUI = () => {
        if (currentQuestion === undefined) return (<></>);
        if (currentQuestion.type === QuestionType.MultipleChoice) {
            return (<MCQuestion question={currentQuestion} uid={currentUser.uid} gameId={id}
                setSubmitted={setSubmittedAnswer} revealAnswer={revealAnswer} />
            );
        } else if (currentQuestion.type === QuestionType.TrueFalse) {
            return (<TFQuestion question={currentQuestion} uid={currentUser.uid} gameId={id}
                setSubmitted={setSubmittedAnswer} revealAnswer={revealAnswer} />
            );
        } else if (currentQuestion.type === QuestionType.ShortAnswer) {
            return (<ShortAnswerQuestion question={currentQuestion} uid={currentUser.uid} gameId={id}
                setSubmitted={setSubmittedAnswer} revealAnswer={revealAnswer} />
            );
        } else if (currentQuestion.type === QuestionType.Flashcard) {
            return (<FlashcardQuestion question={currentQuestion} uid={currentUser.uid} gameId={id}
                setSubmitted={setSubmittedAnswer} revealAnswer={revealAnswer} />
            );
        }

        return (<></>);
    };

    useEffect(() => {
        if (!signedIn || currentUser === null || id === undefined) return;

        (async () => {
            const { userInGame, error } = await initClient(id, currentUser);
            setInGame(userInGame);

            if (userInGame) {
                const gameData = await getGameData(id);
                if (!gameData) {
                    window.location.href = '/';
                    return;
                }

                const { unsubscribeEvent, unsubscribeNewPlayer, unsubscribeLeavePlayer } = await subscribeToGame(id, onGameEvent, onUserJoin, onUserLeave);
                window.onunload = unloadCallback(id, currentUser, unsubscribeEvent, unsubscribeNewPlayer, unsubscribeLeavePlayer);

                setLoadingData(false);
            }
        })();

        createSession(id);
    }, [currentUser, id, signedIn]);

    if (userLoading || loadingData) {
        return (<Loading />);
    } else if (!signedIn) {
        return (<NeedSignin />)
    } else if (!inGame) {
        return (<NotInGame />);
    }

    if (gameState === 'pregame') {
        return (<GameLobby currentUser={currentUser} gameId={id} leaveHandle={async () => { await leaveGame(id, currentUser); }} />);
    } else if (gameState === 'endgame') {
        return (<GameEnded currentUser={currentUser} gameId={id} />);
    } else if (gameState === 'livegame-waiting') {
        return (<ClientWaiting />);
    }

    if (currentQuestion === undefined) return (<Loading />);

    if (submittedAnswer && !revealAnswer) {
        return (
            <Waiting>
                <h1 className={styles.waiting_title}>{getRandomSubmittedAnswerPhrase()}</h1>
            </Waiting>
        );
    }

    return (
        <CorrectAnswerContext.Provider value={{ get: correctAnswer, set: setCorrectAnswer }}>
            {getQuestionUI()}
        </CorrectAnswerContext.Provider>
    );
}