'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Dispatch, SetStateAction } from 'react'
import questionStyles from './basestyles.module.css'
import styles from './shortanswer.module.css'
import { Question } from '@/backend/live/set'
import { TrashSVG } from '@/svg'
import QuestionImage from './questionimage'

export default function ShortAnswerQuestion(props: { question: Question, questionIndex: number, questionUiData: any[], setQuestions: Dispatch<SetStateAction<any>> }) {
    const getColor = (index: number) => {
        const colors = [questionStyles.option_red, questionStyles.option_blue, questionStyles.option_green, questionStyles.option_yellow];
        return colors[index % colors.length];
    };

    return (
        <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: props.questionUiData[props.questionIndex].open ? 1 : 0 }} style={{ transformOrigin: 'top', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <QuestionImage question={props.question} setQuestions={props.setQuestions} />

            <div className={styles.controls_bar}>
                <h1>Correct Answers: </h1>
                <button className={styles.add_remove_answer} onClick={() => {
                    props.question.options[0].optionData.correctAnswers.push('');
                    props.setQuestions((oldQuestions: any) => [...oldQuestions]);
                }}><p>+</p></button>
            </div>
            <div className={styles.correct_answers_container}>
                {props.question.options[0].optionData.correctAnswers.map((answer: string, index: number) => {
                    return (
                        <motion.div key={index} className={`${styles.option} ${getColor(index)}`} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}>
                            <input className={styles.option_input} placeholder={`Correct Answer ${index + 1}`} value={answer} onChange={(e) => {
                                props.question.options[0].optionData.correctAnswers[index] = e.target.value;
                                props.setQuestions((oldQuestions: any) => [...oldQuestions]);
                            }} />
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => {
                                props.question.options[0].optionData.correctAnswers.splice(index, 1);
                                props.setQuestions((oldQuestions: any) => [...oldQuestions]);
                            }}>
                                <TrashSVG className={styles.trash_bin} />
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    )
}