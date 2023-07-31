'use client'

import { Question } from '@/backend/set';
import styles from './question.module.css';
import BaseHostRevealedQuestion from '../baserevealedquestion';

export default function HostRevealedTrueFalseQuestion(props: { question: Question, nextQuestion: () => Promise<void> }) {
    return (
        <BaseHostRevealedQuestion question={props.question} nextQuestion={props.nextQuestion}>
            <div className={styles.questions}>
                <div className={`${styles.question_box} ${styles.question_red} ${props.question.options[0].correct ? styles.option_correct : styles.option_incorrect}`}>
                    <h1 className={styles.question_option}>{props.question.options[0].option}</h1>
                </div>
                <div className={`${styles.question_box} ${styles.question_blue} ${props.question.options[1].correct ? styles.option_correct : styles.option_incorrect}`}>
                    <h1 className={styles.question_option}>{props.question.options[1].option}</h1>
                </div>
            </div>
        </BaseHostRevealedQuestion>
    );
}