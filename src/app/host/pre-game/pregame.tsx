'use client'

import { GameUser } from '@/backend/live/user';
import styles from './pregame.module.css';

export default function PreGame(props: { gameId: string, users: GameUser[], start: () => Promise<any>, end: () => Promise<any> }) {
    return(
        <div>
            {props.users.map((user, index) => {
                return(
                    <div key={index}>
                        <h1 style={{color: 'black', fontFamily: 'SF Pro Display'}}>{user.name}</h1>
                    </div>
                );
            })}

            <button onClick={props.start}>Start Game</button>
            <button onClick={props.end}>End Game</button>
        </div>
    );
}