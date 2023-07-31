'use client'

import styles from './question.module.css';
import { Question } from '@/backend/set';
import BaseHostQuestion from '../basequestion';

export default function HostTrueFalseQuestion(props: { question: Question, revealAnswer: () => Promise<void> }) {
    return (
        <BaseHostQuestion question={props.question} revealAnswer={props.revealAnswer}>
            <div className={styles.questions}>
                <div className={`${styles.question_box} ${styles.question_red}`}>
                    <h1 className={styles.question_option}>{props.question.options[0].option}</h1>
                </div>
                <div className={`${styles.question_box} ${styles.question_blue}`}>
                    <h1 className={styles.question_option}>{props.question.options[1].option}</h1>
                </div>
            </div>
        </BaseHostQuestion>
    );
}