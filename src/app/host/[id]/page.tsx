'use client'

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getGameData, } from '@/backend/live/game';
import useCurrentUser from '@/hooks/useCurrentUser';


import styles from './page.module.css';
import Loading from '@/components/loading/loading';
import HostDashboard from '@/host/host';

export default function HostPage() {
    const pathname = usePathname();
    const gameId = pathname.split('/')[2];
    const router = useRouter();

    const { currentUser, signedIn, userLoading } = useCurrentUser();
    const [loadingData, setLoadingData] = useState(true);

    const [setId, setSetId] = useState<string>('');

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
            setLoadingData(false);
        })();
    }, [currentUser, gameId, signedIn]);

    if (loadingData || !signedIn || currentUser === null || gameId === undefined) return (<Loading />);
    
    return (
        <HostDashboard gameId={gameId} setId={setId} />
    );
}