'use client'

import styles from './question.module.css';
import { Question } from '@/backend/live/set';
import BaseHostQuestion from '../basequestion';

export default function HostMultipleChoiceQuestion(props: { question: Question, revealAnswer: () => Promise<void> }) {
    const colors: string[] = [styles.question_red, styles.question_blue, styles.question_green, styles.question_yellow];

    return (
        <BaseHostQuestion question={props.question} revealAnswer={props.revealAnswer}>
            <div className={styles.questions} style={{
                '--num-rows': Math.ceil(props.question.options.length / 2)
            } as React.CSSProperties}>
                {props.question.options.map((option, index) => {
                    return (
                        <div className={`${styles.question_box} ${colors[index % colors.length]}`} key={index}>
                            <h1 className={styles.question_option}>{option.option}</h1>
                        </div>
                    )
                })}
            </div>
        </BaseHostQuestion>
    );
}