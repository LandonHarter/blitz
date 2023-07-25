'use client'

import styles from './page.module.css';
import { Question } from "@/backend/live/set";

export default function FlashcardAnswerDropdown(props: { question: Question }) {
    return (
        <div className={styles.flashcard_answer_container}>
            <div className={`${styles.option}`}>
                <h1>{props.question.options[0].optionData.answer}</h1>
            </div>
        </div>
    );
}