'use client'

import { motion } from 'framer-motion';
import { Question } from '@/backend/live/set';

import styles from './mcq.module.css';
import questionStyles from './basestyles.module.css';
import { Dispatch, SetStateAction } from 'react';
import QuestionImage from './questionimage';

export default function MultipleChoiceQuestion(props: { question: Question, questionIndex: number, questionUiData: any[], setQuestions: Dispatch<SetStateAction<any>> }) {
    const colorFromIndex = (index: number) => {
        const colors = [questionStyles.option_red, questionStyles.option_blue, questionStyles.option_green, questionStyles.option_yellow];
        return colors[index];
    };

    return (
        <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: props.questionUiData[props.questionIndex].open ? 1 : 0 }} className={styles.mcq_container}>
            <QuestionImage question={props.question} setQuestions={props.setQuestions} />
            <div className={styles.options_container}>
                {props.question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className={`${styles.option} ${colorFromIndex(optionIndex)}`}>
                        <input className={questionStyles.inp_cbx} id={`correct-${props.question.options[optionIndex].id}`} type="checkbox" style={{ display: 'none' }} checked={option.correct} onChange={(e) => {
                            option.correct = e.target.checked;
                            props.setQuestions((oldQuestions: any) => [...oldQuestions]);
                        }} />
                        <label className={questionStyles.cbx} htmlFor={`correct-${props.question.options[optionIndex].id}`}>
                            <span>
                                <svg width="12px" height="9px" viewBox="0 0 12 9">
                                    <polyline points="1 5 4 8 11 1"></polyline>
                                </svg>
                            </span>
                        </label>
                        <input className={styles.option_input} placeholder={`Option ${optionIndex + 1}`} value={option.option} onChange={(e) => {
                            option.option = e.target.value;
                            props.setQuestions((oldQuestions: any) => [...oldQuestions]);
                        }} />
                    </div>
                ))}
            </div>
        </motion.div>
    );
}