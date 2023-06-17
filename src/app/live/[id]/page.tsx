'use client'

import { usePathname } from "next/navigation";
import useCurrentUser from "@hooks/useCurrentUser";
import Loading from "@components/loading/loading";
import { useEffect, useState } from "react";
import { get, ref } from "firebase/database";
import { realtimeDb } from "@baas/init";

import styles from './page.module.css';

export default function LiveGamePage() {
    const id = usePathname().split('/')[2];

    const [inGame, setInGame] = useState(false);
    const { currentUser, signedIn, loading } = useCurrentUser();

    useEffect(() => {
        if (!signedIn || currentUser === null || id === undefined) return;
        const gameRef = ref(realtimeDb, `live-games/${id}/users/${currentUser.uid}`);
        get(gameRef).then((snapshot) => {
            const userInGame = snapshot.exists();
            setInGame(userInGame);
        });

    }, [currentUser, id, signedIn]);

    if (loading) {
        return(<Loading />);
    } else if (!signedIn) {
        return(<h1>You need to be signed in to join a game</h1>)
    } else if (!inGame) {
        return(<h1>You are not in this game</h1>);
    }

    return(
        <div>
            <h1>Live Game Page</h1>
        </div>
    );
}