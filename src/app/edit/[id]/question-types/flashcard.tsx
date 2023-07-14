'use client'

import { motion } from 'framer-motion'
import { Dispatch, SetStateAction } from 'react'
import questionStyles from './basestyles.module.css'
import styles from './flashcard.module.css'
import { Question } from '@/backend/live/set'

export default function FlashcardQuestion(props: { question: Question, questionIndex: number, questionUiData: any[], setQuestions: Dispatch<SetStateAction<any>> }) {
    return (
        <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: props.questionUiData[props.questionIndex].open ? 1 : 0 }} style={{ transformOrigin: 'top' }}>
            <div className={`${styles.input_card} ${questionStyles.option_red}`}>
                <input placeholder='Term here' className={styles.flashcard_term_input} value={props.question.options[0].optionData.answer} onChange={(e) => {
                    props.question.options[0].optionData.answer = e.target.value;
                    props.setQuestions((oldQuestions: any) => [...oldQuestions]);
                }} />
            </div>
        </motion.div>
    )
}