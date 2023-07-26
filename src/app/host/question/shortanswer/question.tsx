'use client'

import styles from './question.module.css';
import { Question } from '@/backend/set';
import BaseHostQuestion from '../basequestion';

export default function HostShortAnswerQuestion(props: { question: Question, revealAnswer: () => Promise<void> }) {
    return (
        <BaseHostQuestion question={props.question} revealAnswer={props.revealAnswer}>
            <div className={styles.input_answer_container}>
                <h1>Input your answers!</h1>
            </div>
        </BaseHostQuestion>
    );
}