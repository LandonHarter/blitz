'use client'

import { motion } from 'framer-motion';
import styles from './question.module.css';
import { Question } from '@/backend/live/set';
import { useEffect } from 'react';

export default function HostQuestion(props: { question:Question, submittedAnswers:number, revealAnswer:() => Promise<void> }) {
    const timerLength = 15;

    useEffect(() => {
        setTimeout(async () => {
            await props.revealAnswer();
        }, timerLength * 1000);
    }, [props.question]);
    

    return(
        <div className={styles.question_container}>
            <div className={styles.top_bar}>
                <h1 className={styles.question}>{props.question.question}</h1>
            </div>
            <div className={styles.timer}>
                <motion.div initial={{ transform: 'scaleX(1)' }} animate={{ transform: 'scaleX(0)' }} transition={{ duration: timerLength, ease: 'linear' }} className={styles.timer_bar} />
            </div>
            <div className={styles.bottom_bar}>
                <div className={styles.questions}>
                    <div className={`${styles.question_box} ${styles.question_red}`}>
                        <h1 className={styles.question_option}>{props.question.options[0].option}</h1>
                    </div>
                    <div className={`${styles.question_box} ${styles.question_blue}`}>
                        <h1 className={styles.question_option}>{props.question.options[1].option}</h1>
                    </div>
                    <div className={`${styles.question_box} ${styles.question_green}`}>
                        <h1 className={styles.question_option}>{props.question.options[2].option}</h1>
                    </div>
                    <div className={`${styles.question_box} ${styles.question_yellow}`}>
                        <h1 className={styles.question_option}>{props.question.options[3].option}</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}