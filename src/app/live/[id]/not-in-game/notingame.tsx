'use client'

import Link from 'next/link';
import styles from './notingame.module.css';

export default function NotInGame() {
    return(
        <div className={styles.not_in_game_background}>
            <div className={styles.content}>
                <h1 className={styles.title}>Oops! You are not in this game.</h1>

                <Link href='/join'><button className={styles.gojoin}>Return</button></Link>
            </div>
        </div>
    );
}