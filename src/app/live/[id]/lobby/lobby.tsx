'use client'

import { GameUser } from '@/backend/live/user';
import { leaveGame } from '@/backend/live/game';
import styles from './lobby.module.css';
import { useRouter } from 'next/navigation';
import { User } from '@/backend/firebase/user';
import { getRandomPreGamePhrase } from '@/backend/phrase';
import { motion } from 'framer-motion';

export default function GameLobby(props:{ currentUser:User, users:GameUser[], gameId:string, leaveHandle:() => Promise<void> }) {
    const router = useRouter();

    return(
        <div className={styles.container}>
            <h1 className={styles.title}>{getRandomPreGamePhrase()}</h1>
            <motion.button whileTap={{ scale: 0.95 }} className={styles.leave_button} onClick={async () => {
                await props.leaveHandle();
                router.push('/join');
            }}>Leave</motion.button>
        </div>
    );
}