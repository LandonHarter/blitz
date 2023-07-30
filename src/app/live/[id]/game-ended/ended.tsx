'use client'

import { GameUser } from '@/backend/live/user';
import styles from './ended.module.css';
import { User } from '@/backend/firebase/user';
import BasicReturn from '@/components/basic-return/return';
import { analyzeSession, getLink } from '@/backend/analyze';

export default function GameEnded(props: { currentUser: User, gameId: string }) {
    return (
        <div>
            <BasicReturn text='Good game!' returnLink='/join' others={[
                { text: 'Analyze', link: getLink(props.gameId, 'live'), newTab: true },
            ]} />
        </div>
    );
}