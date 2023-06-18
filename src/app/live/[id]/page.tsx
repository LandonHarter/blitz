'use client'

import { usePathname, useRouter } from "next/navigation";
import useCurrentUser from "@hooks/useCurrentUser";
import Loading from "@components/loading/loading";
import { useEffect, useState } from "react";
import { DataSnapshot, get, ref, set } from "firebase/database";
import { realtimeDb } from "@baas/init";

import styles from './page.module.css';
import { GameUser } from "@/backend/live/user";
import { getUsersInGame, leaveGame, subscribeToGame } from "@/backend/live/game";

export default function LiveGamePage() {
    const router = useRouter();
    const id = usePathname().split('/')[2];

    const [inGame, setInGame] = useState(false);
    const { currentUser, signedIn, loading } = useCurrentUser();

    const [loadingData, setLoadingData] = useState(true);
    const [users, setUsers] = useState<GameUser[]>([]);

    const onGameUpdate = (snapshot:DataSnapshot) => {

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
                //setUsers(await getUsersInGame(id));
                await subscribeToGame(id, onGameUpdate, onUserJoin, onUserLeave);
                setLoadingData(false);
            }
        })();
    }, [currentUser, id, signedIn]);

    if (loading || loadingData) {
        return(<Loading />);
    } else if (!signedIn) {
        return(<h1>You need to be signed in to join a game</h1>)
    } else if (!inGame) {
        return(<h1>You are not in this game</h1>);
    }

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