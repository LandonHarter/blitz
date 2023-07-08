'use client'

import { useEffect, useState } from 'react';
import styles from './waiting.module.css';

export default function HostWaiting(props: { nextQuestion: () => Promise<void> }) {
    const [seconds, setSeconds] = useState<number>(3);
    
    const tickSeconds = (depth:number) => {
        setTimeout(() => {
            if (depth <= 0) {
                props.nextQuestion();
                setSeconds(3);
                return;
            }

            setSeconds(depth - 1);
            tickSeconds(depth - 1);
        }, 1000);
    }

    useEffect(() => {
        tickSeconds(3);
    }, []);

    return(
        <div className={styles.waiting_container}>
            <svg className={styles.circle}>
                <circle cx="70" cy="70" r="35" />
            </svg>
            <h1 className={styles.seconds}>{seconds}</h1>
        </div>
    );
}