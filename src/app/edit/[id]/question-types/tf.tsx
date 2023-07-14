'use client'

import { motion } from 'framer-motion'
import { Dispatch, SetStateAction } from 'react'
import questionStyles from './basestyles.module.css'
import styles from './tf.module.css'
import { Question } from '@/backend/live/set'
import QuestionImage from './questionimage'

export default function TrueFalseQuestion(props: { question: Question, questionIndex: number, questionUiData: any[], setQuestions: Dispatch<SetStateAction<any>> }) {
    return (
        <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: props.questionUiData[props.questionIndex].open ? 1 : 0 }} style={{ transformOrigin: 'top', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <QuestionImage question={props.question} setQuestions={props.setQuestions} />

            <div className={styles.true_false_container}>
                <div className={`${styles.option} ${questionStyles.option_red}`}>
                    <input className={questionStyles.inp_cbx} id={`correct-${props.question.options[0].id}`} type="checkbox" style={{ display: 'none' }} checked={props.question.options[0].correct} onChange={(e) => {
                        props.question.options[0].correct = e.target.checked;
                        props.setQuestions((oldQuestions: any) => [...oldQuestions]);
                    }} />
                    <label className={questionStyles.cbx} htmlFor={`correct-${props.question.options[0].id}`}>
                        <span>
                            <svg width="12px" height="9px" viewBox="0 0 12 9">
                                <polyline points="1 5 4 8 11 1"></polyline>
                            </svg>
                        </span>
                    </label>
                    <h1 className={styles.option_title}>True</h1>
                </div>
                <div className={`${styles.option} ${questionStyles.option_blue}`}>
                    <input className={questionStyles.inp_cbx} id={`correct-${props.question.options[1].id}`} type="checkbox" style={{ display: 'none' }} checked={props.question.options[1].correct} onChange={(e) => {
                        props.question.options[1].correct = e.target.checked;
                        props.setQuestions((oldQuestions: any) => [...oldQuestions]);
                    }} />
                    <label className={questionStyles.cbx} htmlFor={`correct-${props.question.options[1].id}`}>
                        <span>
                            <svg width="12px" height="9px" viewBox="0 0 12 9">
                                <polyline points="1 5 4 8 11 1"></polyline>
                            </svg>
                        </span>
                    </label>
                    <h1 className={styles.option_title}>False</h1>
                </div>
            </div>
        </motion.div>
    )
}