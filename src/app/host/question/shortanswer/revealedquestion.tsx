'use client'

import { Question } from '@/backend/live/set';
import styles from './question.module.css';
import BaseHostRevealedQuestion from '../baserevealedquestion';

export default function HostRevealedShortAnswerQuestion(props: { question: Question, nextQuestion: () => Promise<void> }) {
    const colors = [styles.accepted_answer_red, styles.accepted_answer_blue, styles.accepted_answer_green, styles.accepted_answer_yellow];

    return (
        <BaseHostRevealedQuestion question={props.question} nextQuestion={props.nextQuestion}>
            <div className={styles.accepted_answers_container}>
                <div className={styles.accepted_answers}>
                    {props.question.options[0].optionData.correctAnswers.map((answer: string, index: number) => {
                        return (
                            <div key={index} className={`${styles.accepted_answer} ${colors[index % 4]}`}>
                                <h1>{answer}</h1>
                            </div>
                        );
                    })}
                </div>
            </div>
        </BaseHostRevealedQuestion >
    );
}