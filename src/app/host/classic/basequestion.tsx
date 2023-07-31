'use client'

import { motion } from 'framer-motion';
import { Question } from '@/backend/set';
import { useEffect, useState } from 'react';
import styles from './basequestion.module.css';

export default function BaseHostQuestion(props: { children: any, question: Question, revealAnswer: () => Promise<void> }) {
    useEffect(() => {
        const timer = setTimeout(async () => {
            await props.revealAnswer();
        }, (props.question.questionLength || 15) * 1000);
        return () => {
            clearTimeout(timer);
        }
    }, [props.question]);

    return (
        <div className={styles.question_container}>
            <div className={styles.top_bar}>
                <h1 className={styles.question}>{props.question.question}</h1>
                {props.question.photo !== '' &&
                    <div className={styles.question_photo} style={{ backgroundImage: `url('${props.question.photo}'` }} />
                }
            </div>
            <div className={styles.timer}>
                <motion.div initial={{ transform: 'scaleX(1)' }} animate={{ transform: 'scaleX(0)' }} transition={{ duration: (props.question.questionLength || 15), ease: 'linear' }} className={styles.timer_bar} />
            </div>
            <div className={styles.bottom_bar}>
                {props.children}
            </div>
        </div>
    );
}