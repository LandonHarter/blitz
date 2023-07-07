'use client'

import { Question } from '@/backend/live/set';
import { motion } from 'framer-motion';
import styles from './question.module.css';

export default function HostRevealedQuestion(props: { question:Question, nextQuestion: () => Promise<void> }) {
    return(
        <div className={styles.question_container}>
            <div className={styles.top_bar}>
                <h1 className={styles.question}>{props.question.question}</h1>
                <motion.button className={styles.next_button} onClick={async () => {
                    await props.nextQuestion();
                }}>Next</motion.button>
            </div>
            <div className={styles.timer}>
                <div className={styles.timer_bar} style={{ transform: 'scaleX(0)' }} />
            </div>
            <div className={styles.bottom_bar}>
                <div className={styles.questions}>
                    <div className={`${styles.question_box} ${styles.question_red} ${props.question.options[0].correct ? styles.option_correct : styles.option_incorrect}`}>
                        <h1 className={styles.question_option}>{props.question.options[0].option}</h1>
                    </div>
                    <div className={`${styles.question_box} ${styles.question_blue} ${props.question.options[1].correct ? styles.option_correct : styles.option_incorrect}`}>
                        <h1 className={styles.question_option}>{props.question.options[1].option}</h1>
                    </div>
                    <div className={`${styles.question_box} ${styles.question_green} ${props.question.options[2].correct ? styles.option_correct : styles.option_incorrect}`}>
                        <h1 className={styles.question_option}>{props.question.options[2].option}</h1>
                    </div>
                    <div className={`${styles.question_box} ${styles.question_yellow} ${props.question.options[3].correct ? styles.option_correct : styles.option_incorrect}`}>
                        <h1 className={styles.question_option}>{props.question.options[3].option}</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}