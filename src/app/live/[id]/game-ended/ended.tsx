'use client'

import { GameUser } from '@/backend/live/user';
import styles from './ended.module.css';
import { User } from '@/backend/firebase/user';

export default function GameEnded(props:{ currentUser:User, users:GameUser[], gameId:string }) {
    return(
        <div>

        </div>
    );
}