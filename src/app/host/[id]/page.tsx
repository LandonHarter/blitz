'use client'

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { GameEvent } from '@/backend/live/game';
import { Question, QuestionType } from '@/backend/live/quiz';
import { EventType } from '@/backend/live/events/event';
import { GameUser } from '@/backend/live/user';
import { getGameData, subscribeToGame } from '@/backend/live/game';
import { realtimeDb } from '@baas/init';
import { get, ref } from 'firebase/database';
import useCurrentUser from '@/hooks/useCurrentUser';

import styles from './page.module.css';
import Loading from '@/components/loading/loading';
import HostDashboard from '@/host/host';

export default function HostPage() {
    const gameId = usePathname().split('/')[2];
    const router = useRouter();

    const { currentUser, signedIn, userLoading } = useCurrentUser();
    const [users, setUsers] = useState<GameUser[]>([]);

    const [loadingData, setLoadingData] = useState(true);
    const [gameStarted, setGameStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<Question>();
    const [currentNumAnswers, setCurrentNumAnswers] = useState<number>(0);

    const [quizId, setQuizId] = useState<string>('');

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
            await subscribeToGame(gameId, onGameEvent, onUserJoin, onUserLeave);
            const gameData = await getGameData(gameId);
            if (gameData.host !== currentUser.uid) {
                router.push('/');
                return;
            }

            setQuizId(gameData.quizId);
            setLoadingData(false);
        })();
    }, [currentUser, gameId, signedIn]);

    if (loadingData || !signedIn || currentUser === null || gameId === undefined) return (<Loading />);
    
    return (
        <HostDashboard gameId={gameId} quizId={quizId} gameStarted={gameStarted} />
    );
}