'use client'

import { Question } from '@/backend/set';
import styles from './question.module.css';
import BaseHostRevealedQuestion from '../baserevealedquestion';

export default function HostRevealedMultipleChoiceQuestion(props: { question: Question, nextQuestion: () => Promise<void> }) {
    const colors: string[] = [styles.question_red, styles.question_blue, styles.question_green, styles.question_yellow];

    return (
        <BaseHostRevealedQuestion question={props.question} nextQuestion={props.nextQuestion}>
            <div className={styles.questions} style={{
                '--num-rows': Math.ceil(props.question.options.length / 2)
            } as React.CSSProperties}>
                {props.question.options.map((option, index) => {
                    return (
                        <div className={`${styles.question_box} ${colors[index % colors.length]} ${option.correct ? styles.option_correct : styles.option_incorrect}`} key={index}>
                            <h1 className={styles.question_option}>{option.option}</h1>
                        </div>
                    )
                })}
            </div>
        </BaseHostRevealedQuestion>
    );
}