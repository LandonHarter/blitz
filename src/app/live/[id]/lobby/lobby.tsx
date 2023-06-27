'use client'

import { GameUser } from '@/backend/live/user';
import { leaveGame } from '@/backend/live/game';
import styles from './lobby.module.css';
import { useRouter } from 'next/navigation';
import { User } from '@/backend/firebase/user';

export default function GameLobby(props:{ currentUser:User, users:GameUser[], gameId:string }) {
    const router = useRouter();

    return(
        <div>
            <button className={styles.leave_button} onClick={async () => {
                await leaveGame(props.gameId, props.currentUser);
                router.push('/join');
            }}>Leave</button>
        </div>
    );
}