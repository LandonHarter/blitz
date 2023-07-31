'use client'

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GameType, getGameData, } from '@/backend/live/game';
import useCurrentUser from '@/hooks/useCurrentUser';

import Loading from '@/components/loading/loading';
import ClassicHostDashboard from '../classic/dashboard';

export default function HostPage() {
    const pathname = usePathname();
    const gameId = pathname.split('/')[2];
    const router = useRouter();

    const { currentUser, signedIn } = useCurrentUser();
    const [loadingData, setLoadingData] = useState(true);
    const [setId, setSetId] = useState<string>('');
    const [gameType, setGameType] = useState<GameType>(GameType.None);

    const getHostUI = () => {
        if (gameType === GameType.Classic) {
            return (<ClassicHostDashboard gameId={gameId} setId={setId} />);
        }

        return (<></>);
    }

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

            setSetId(gameData.setId);

            const gameTypeString = gameData.gameType;
            if (gameTypeString === 'classic') {
                setGameType(GameType.Classic);
            } else {
                setGameType(GameType.None);
            }

            setLoadingData(false);
        })();
    }, [currentUser, gameId, signedIn]);

    if (loadingData || !signedIn || currentUser === null || gameId === undefined) return (<Loading />);

    return getHostUI();
}