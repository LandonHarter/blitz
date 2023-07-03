'use client'

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { GameEvent } from '@/backend/live/game';
import { Question, QuestionType } from '@/backend/live/set';
import { EventType } from '@/backend/live/events/event';
import { GameUser } from '@/backend/live/user';
import { getGameData, subscribeToGame, pushGameEvent, deleteGame } from '@/backend/live/game';
import generateId from '@/backend/id';
import useCurrentUser from '@/hooks/useCurrentUser';


import styles from './page.module.css';
import Loading from '@/components/loading/loading';
import HostDashboard from '@/host/host';

export default function HostPage() {
    const pathname = usePathname();
    const gameId = pathname.split('/')[2];
    const router = useRouter();

    const { currentUser, signedIn, userLoading } = useCurrentUser();
    const [users, setUsers] = useState<GameUser[]>([]);

    const [currentQuestion, setCurrentQuestion] = useState<Question|null>(null);
    const [currentNumAnswers, setCurrentNumAnswers] = useState<number>(0);

    const [loadingData, setLoadingData] = useState(true);
    const [gameStarted, setGameStarted] = useState(false);

    const [setId, setSetId] = useState<string>('');

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
        if (!signedIn || currentUser === null || gameId === undefined) return;

        (async () => {
            const gameData = await getGameData(gameId);
            if (!gameData) {
                router.push('/');
                return;
            }

            if (gameData.host !== currentUser.uid) {
                router.push('/');
                return;
            }

            const { unsubscribeEvent, unsubscribeNewPlayer, unsubscribeLeavePlayer } = await subscribeToGame(gameId, onGameEvent, onUserJoin, onUserLeave);
            window.onbeforeunload = async () => {
                unsubscribeEvent();
                unsubscribeNewPlayer();
                unsubscribeLeavePlayer();

                await pushGameEvent(gameId, {
                    eventType: EventType.EndGame,
                    eventData: {},
                    eventId: generateId()
                });
                await deleteGame(gameId);
            };

            setSetId(gameData.setId);
            setLoadingData(false);
        })();
    }, [currentUser, gameId, signedIn]);

    const unload = useRef(async () => {});
    useEffect(() => {
        unload.current();
    }, [pathname]);

    if (loadingData || !signedIn || currentUser === null || gameId === undefined) return (<Loading />);
    
    return (
        <HostDashboard gameId={gameId} setId={setId} gameStarted={gameStarted} />
    );
}