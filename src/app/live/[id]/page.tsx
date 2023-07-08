'use client'

import { usePathname, useRouter } from "next/navigation";
import useCurrentUser from "@hooks/useCurrentUser";
import Loading from "@components/loading/loading";
import { useEffect, useState } from "react";
import { DataSnapshot, get, ref, set } from "firebase/database";
import { realtimeDb } from "@baas/init";

import styles from './page.module.css';
import { GameUser } from "@/backend/live/user";
import { GameEvent, getGameData, leaveGame, subscribeToGame } from "@/backend/live/game";
import { EventType } from "@/backend/live/events/event";
import HostDashboard from "../../host/host";
import MCQuestion from "./question/mcq/question";
import { Question, QuestionType } from "@/backend/live/set";
import Waiting from "./waiting/waiting";
import NeedSignin from "@/components/require-signin/needsignin";
import GameLobby from "./lobby/lobby";
import GameEnded from "./game-ended/ended";
import NotInGame from "./not-in-game/notingame";
import ClientWaiting from "./waiting/startgamewait";

export default function LiveGamePage() {
    const router = useRouter();
    const id = usePathname().split('/')[2];

    const [inGame, setInGame] = useState(false);
    const { currentUser, signedIn, userLoading } = useCurrentUser();

    const [loadingData, setLoadingData] = useState(true);
    const [users, setUsers] = useState<GameUser[]>([]);

    const [gameState, setGameState] = useState<string>('pregame');
    const [numPlayers, setNumPlayers] = useState<number>(0);
    const [currentQuestion, setCurrentQuestion] = useState<Question>();
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState<number>(0);
    const [submittedAnswer, setSubmittedAnswer] = useState<boolean>(false);
    const [revealAnswer, setRevealAnswer] = useState<boolean>(false);

    const [handleLeave, setHandleLeave] = useState<() => Promise<void>>(async () => {});

    const [currentNumAnswers, setCurrentNumAnswers] = useState<number>(0);
    const [lastEvent, setLastEvent] = useState<GameEvent>({
        eventType: EventType.None,
        eventData: {},
        eventId: ''
    });

    const onGameEvent = (event:GameEvent) => {
        if (event.eventType === EventType.StartGame) {
            setGameState('livegame-waiting');
        } else if (event.eventType === EventType.NextQuestion) {
            setGameState('livegame');
            setCurrentNumAnswers(0);
            setSubmittedAnswer(false);
            setRevealAnswer(false);
            setCurrentQuestion({
                id: event.eventData.questionId,
                question: event.eventData.question,
                type: QuestionType[event.eventData.type as keyof typeof QuestionType],
                options: event.eventData.options
            });
            setCurrentQuestionNumber((prevNum) => prevNum + 1); 
        } else if (event.eventType === EventType.SubmitAnswer) {
            setCurrentNumAnswers((prevNum) => prevNum + 1);
        } else if (event.eventType === EventType.RevealAnswer) {
            setRevealAnswer(true);
        } else if (event.eventType === EventType.EndGame) {
            setGameState('endgame');
            // @ts-ignore
            window.onbeforeunload.call(null);
            window.onbeforeunload = null;
        } else if (event.eventType === EventType.KickPlayer) {
            if (currentUser?.uid === event.eventData.uid) {
                const unload = window.onbeforeunload;
                if (unload) {
                    // @ts-ignore
                    unload.call(null);

                    window.onbeforeunload = null;
                }
                window.location.href = '/join';
            }
        } else if (event.eventType === EventType.InbetweenQuestions) {
            setGameState('livegame-waiting');
        }

        setLastEvent(event);
    };

    const onUserJoin = (user:GameUser) => {
        setUsers((prevUsers) => [...prevUsers, {
            name: user.name,
            uid: user.uid,
            pfp: user.pfp,
            email: user.email,
            points: user.points
        }]);
        setNumPlayers((prevNum) => prevNum + 1);
    };

    const onUserLeave = (user:GameUser) => {
        setUsers((prevUsers) => prevUsers.filter(u => u.uid !== user.uid));
        setNumPlayers((prevNum) => prevNum - 1);
    };

    useEffect(() => {
        if (!signedIn || currentUser === null || id === undefined) return;
        const gameRef = ref(realtimeDb, `live-games/${id}/users/${currentUser.uid}`);

        (async () => {
            if (!(await get(ref(realtimeDb, `live-games/${id}`))).exists()) {
                setLoadingData(false);
            }

            const snapshot = await get(gameRef);
            const userInGame = snapshot.exists();
            setInGame(userInGame);

            if (userInGame) {
                const gameData = await getGameData(id);
                if (!gameData) {
                    window.location.href = '/';
                    return;
                }

                const { unsubscribeEvent, unsubscribeNewPlayer, unsubscribeLeavePlayer } = await subscribeToGame(id, onGameEvent, onUserJoin, onUserLeave);
                window.onbeforeunload = async () => {
                    unsubscribeEvent();
                    unsubscribeNewPlayer();
                    unsubscribeLeavePlayer();

                    await leaveGame(id, currentUser);
                };

                setNumPlayers(gameData.numPlayers);
                setLoadingData(false);
            }
        })();
    }, [currentUser, id, signedIn]);

    if (userLoading || loadingData) {
        return(<Loading />);
    } else if (!signedIn) {
        return(<NeedSignin />)
    } else if (!inGame) {
        return(<NotInGame />);
    }

    if (gameState === 'pregame') {
        return(<GameLobby users={users} currentUser={currentUser} gameId={id} leaveHandle={handleLeave} />);
    } else if (gameState === 'endgame') {
        return(<GameEnded users={users} currentUser={currentUser} gameId={id} />);
    } else if (gameState === 'livegame-waiting') {
        return(<ClientWaiting />);
    }

    if (currentQuestion === undefined) return(<Loading />);

    if (submittedAnswer && !revealAnswer) {
        return(
            <Waiting>
                <h1>{currentNumAnswers}/{numPlayers} answered</h1>
            </Waiting>
        );
    }

    return(
        <div>
            <MCQuestion question={currentQuestion} questionNumber={currentQuestionNumber} currentNumAnswers={currentNumAnswers} gameId={id} lastEvent={lastEvent} setSubmitted={setSubmittedAnswer} revealAnswer={revealAnswer} />
        </div>
    );
}