'use client'

import styles from './page.module.css';
import { Question } from "@/backend/set";

export default function OptionDropdown(props: { question: Question }) {
    return (
        <div className={styles.options_container}>
            {props.question.options.map((option, index) => {
                return (
                    <div className={`${styles.option} ${option.correct && styles.option_correct}`} key={index}>
                        <h1>{option.option}</h1>
                    </div>
                )
            })}
        </div>
    );
}