'use client'

import { GameUser } from '@/backend/live/user';
import styles from './ended.module.css';
import { User } from '@/backend/firebase/user';
import BasicReturn from '@/components/basic-return/return';

export default function GameEnded(props:{ currentUser:User, users:GameUser[], gameId:string }) {
    return(
        <div>
            <BasicReturn text='Good game!' returnLink='/join' />
        </div>
    );
}