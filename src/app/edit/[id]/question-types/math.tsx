'use client'

import { motion } from 'framer-motion'
import { Dispatch, SetStateAction, useContext, useState } from 'react'
import questionStyles from './basestyles.module.css'
import styles from './math.module.css'
import { Question } from '@/backend/set'
import QuestionImage from './questionimage'
import Image from 'next/image'
import DarkModeContext from '@/context/darkmode'
import { SourceSpecification, useMathJax } from 'mathjax-react'

export default function MathQuestion(props: { question: Question, questionIndex: number, questionUiData: any[], setQuestions: Dispatch<SetStateAction<any>>, settingsPopup: Dispatch<SetStateAction<any>> }) {
    const { get: darkMode } = useContext(DarkModeContext);

    const [sourceSpec, setSourceSpec] = useState<SourceSpecification>({ lang: 'TeX', src: String.raw`\sin^2 x + cos^2 x = 1` });
    const { getProps, error } = useMathJax({
        ...sourceSpec,
        display: true,
        settings: {}
    });

    const getColor = (index: number) => {
        const colors = [questionStyles.option_red, questionStyles.option_blue, questionStyles.option_green, questionStyles.option_yellow];
        return colors[index % colors.length];
    };

    return (
        <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: props.questionUiData[props.questionIndex].open ? 1 : 0 }} style={{ transformOrigin: 'top', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <QuestionImage question={props.question} setQuestions={props.setQuestions} />

            <div className={styles.controls_bar}>
                <Image src={`/images/icons/${darkMode ? 'dark' : 'light'}/settings.png`} alt='settings' width={30} height={30} onClick={() => {
                    props.settingsPopup({
                        open: true,
                        questionIndex: props.questionIndex,
                    });
                }} className={questionStyles.settings} />
            </div>
            <div className={styles.controls_divider} />
            <div className={styles.answer_container}>
                <div {...getProps()} className={styles.equation} />
            </div>
        </motion.div>
    )
}