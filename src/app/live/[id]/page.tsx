'use client'

import { usePathname, useRouter } from "next/navigation";
import useCurrentUser from "@hooks/useCurrentUser";
import Loading from "@components/loading/loading";
import { useEffect, useState } from "react";
import { DataSnapshot, get, ref, set } from "firebase/database";
import { realtimeDb } from "@baas/init";

import styles from './page.module.css';
import { GameUser } from "@/backend/live/user";
import { GameEvent, getGameData, getUsersInGame, leaveGame, pushGameEvent, startGame, subscribeToGame } from "@/backend/live/game";
import { EventType } from "@/backend/live/events/event";
import HostDashboard from "./host";
import MCQuestion from "./question/mcq/question";
import { Question, QuestionType } from "@/backend/live/quiz";

export default function LiveGamePage() {
    const router = useRouter();
    const id = usePathname().split('/')[2];

    const [inGame, setInGame] = useState(false);
    const { currentUser, signedIn, userLoading } = useCurrentUser();

    const [loadingData, setLoadingData] = useState(true);
    const [users, setUsers] = useState<GameUser[]>([]);
    const [isHost, setIsHost] = useState(false);

    const [gameStarted, setGameStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<Question>();
    const [quizId, setQuizId] = useState<string>('');

    const [currentNumAnswers, setCurrentNumAnswers] = useState<number>(0);
    const [lastEvent, setLastEvent] = useState<GameEvent>({
        eventType: EventType.None,
        eventData: {},
        eventId: ''
    });

    const onGameEvent = (event:GameEvent) => {
        if (event.eventType === EventType.StartGame) {
            setGameStarted(true);
        } else if (event.eventType === EventType.NextQuestion) {
            setCurrentNumAnswers(0);
            setCurrentQuestion({
                id: event.eventData.questionId,
                question: event.eventData.question,
                type: QuestionType[event.eventData.type as keyof typeof QuestionType],
                options: event.eventData.options
            });
        } else if (event.eventType === EventType.SubmitAnswer) {
            setCurrentNumAnswers((prevNum) => prevNum + 1);
        }

        setLastEvent(event);
    };

    const onUserJoin = (user:GameUser) => {
        setUsers((prevUsers) => [...prevUsers, {
            name: user.name,
            uid: user.uid
        }]);
    };

    const onUserLeave = (user:GameUser) => {
        setUsers((prevUsers) => prevUsers.filter(u => u.uid !== user.uid));
    };

    useEffect(() => {
        if (!signedIn || currentUser === null || id === undefined) return;
        const gameRef = ref(realtimeDb, `live-games/${id}/users/${currentUser.uid}`);

        (async () => {
            const snapshot = await get(gameRef)
            const userInGame = snapshot.exists();
            setInGame(userInGame);

            if (userInGame) {
                await subscribeToGame(id, onGameEvent, onUserJoin, onUserLeave);
                const gameData = await getGameData(id);
                setIsHost(gameData.host === currentUser.uid);
                setQuizId(gameData.quizId);

                setLoadingData(false);
            }
        })();
    }, [currentUser, id, signedIn]);

    if (userLoading || loadingData) {
        return(<Loading />);
    } else if (!signedIn) {
        return(<h1>You need to be signed in to join a game</h1>)
    } else if (!inGame) {
        return(<h1>You are not in this game</h1>);
    }

    if (isHost) {
        return(<HostDashboard gameId={id} quizId={quizId} gameStarted={gameStarted} />);
    }

    if (!gameStarted) {
        return(
            <div>
                {users.map((user, i) => {
                    return(
                        <p key={i} style={{fontFamily:'PT Sans, sans-serif'}}>{user.name}</p>
                    );
                })}
                <button className={styles.leave_button} onClick={async () => {
                    await leaveGame(id, currentUser);
                    router.push('/join');
                }}>Leave</button>
            </div>
        );
    }

    if (currentQuestion === undefined) return(<Loading />);

    return(
        <div>
            <MCQuestion question={currentQuestion} questionNumber={1} currentNumAnswers={currentNumAnswers} gameId={id} lastEvent={lastEvent} />
        </div>
    );
}