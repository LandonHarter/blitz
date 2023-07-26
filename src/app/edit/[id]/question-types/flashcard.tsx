'use client'

import { motion } from 'framer-motion'
import { Dispatch, SetStateAction, useContext } from 'react'
import questionStyles from './basestyles.module.css'
import styles from './flashcard.module.css'
import { Question } from '@/backend/set'
import QuestionImage from './questionimage'
import Image from 'next/image'
import DarkModeContext from '@/context/darkmode'

export default function FlashcardQuestion(props: { question: Question, questionIndex: number, questionUiData: any[], setQuestions: Dispatch<SetStateAction<any>>, settingsPopup: Dispatch<SetStateAction<any>> }) {
    const { get: darkMode } = useContext(DarkModeContext);

    return (
        <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: props.questionUiData[props.questionIndex].open ? 1 : 0 }} style={{ transformOrigin: 'top', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <QuestionImage question={props.question} setQuestions={props.setQuestions} />
            <Image src={`/images/icons/${darkMode ? 'dark' : 'light'}/settings.png`} alt='settings' width={30} height={30} onClick={() => {
                props.settingsPopup({
                    open: true,
                    questionIndex: props.questionIndex,
                });
            }} className={questionStyles.settings} />

            <div className={`${styles.input_card} ${questionStyles.option_red}`}>
                <input placeholder='Term here' className={styles.flashcard_term_input} value={props.question.options[0].optionData.answer} onChange={(e) => {
                    props.question.options[0].optionData.answer = e.target.value;
                    props.setQuestions((oldQuestions: any) => [...oldQuestions]);
                }} />
            </div>
        </motion.div>
    )
}