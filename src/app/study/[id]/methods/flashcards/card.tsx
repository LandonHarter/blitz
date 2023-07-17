'use client'

import React, { useState } from 'react';
import styles from './flashcard.module.css';

export default function Flashcard(props: { question: string, answer: string, index: number }) {
    const [flip, setFlip] = useState(false);

    return (
        <div onClick={() => {
            setFlip(!flip);
        }} className={`${styles.flashcard} ${flip && styles.flashcard_flip}`} style={{
            '--rotate-z': `${props.index <= 0 ? 0 : Math.pow(-1, props.index) * 2}deg`,
            zIndex: 3 - props.index
        } as React.CSSProperties}>
            <div className={styles.flashcard_front}>
                <h1>{props.question}</h1>
            </div> :
            <div className={styles.flashcard_back}>
                <h1>{props.answer}</h1>
            </div>
        </div>
    );
}