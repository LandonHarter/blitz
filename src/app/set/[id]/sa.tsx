'use client'

import styles from './page.module.css';
import { Question } from "@/backend/set";

export default function ShortAnswerDropdown(props: { question: Question }) {
    return (
        <div className={styles.options_container}>
            {props.question.options[0].optionData.correctAnswers.map((answer: string, index: number) => {
                return (
                    <div className={`${styles.option}`} key={index}>
                        <h1>{answer}</h1>
                    </div>
                )
            })}
        </div>
    );
}