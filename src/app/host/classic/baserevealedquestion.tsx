'use client'

import { Question } from '@/backend/set';
import { motion } from 'framer-motion';
import styles from './basequestion.module.css';

export default function BaseHostRevealedQuestion(props: { children: any, question: Question, nextQuestion: () => Promise<void> }) {
    return (
        <div className={styles.question_container}>
            <div className={styles.top_bar}>
                <h1 className={styles.question}>{props.question.question}</h1>
                {props.question.photo !== '' &&
                    <div className={styles.question_photo} style={{ backgroundImage: `url('${props.question.photo}'` }} />
                }
                <motion.button className={`${styles.next_button} ${props.question.photo === '' && styles.next_button_noimage}`} onClick={async () => {
                    await props.nextQuestion();
                }}>Next</motion.button>
            </div>
            <div className={styles.timer}>
                <div className={styles.timer_bar} style={{ transform: 'scaleX(0)' }} />
            </div>
            <div className={styles.bottom_bar}>
                {props.children}
            </div>
        </div>
    );
}