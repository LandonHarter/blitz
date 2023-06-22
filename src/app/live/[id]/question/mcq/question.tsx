'use client'

import { Question } from '@/backend/live/set';
import { useEffect, useState } from 'react';

import styles from './question.module.css';
import { GameEvent, pushGameEvent } from '@/backend/live/game';
import { EventType } from '@/backend/live/events/event';
import generateId from '@/backend/id';

export default function MCQuestion(props:{ question:Question, questionNumber:number, currentNumAnswers:number, gameId:string, lastEvent:GameEvent, setSubmitted:Function, revealAnswer:boolean }) {
    const question = props.question;

    const [selectedOption, setSelectedOption] = useState<number>(-1);

    useEffect(() => {
        if (props.lastEvent.eventType === EventType.NextQuestion) {
            setSelectedOption(-1);
        }
    }, [props.lastEvent]);

    if (props.revealAnswer) {
        return(
            <div className={styles.question_background}>
                <h1 className={styles.question_title}>{question.question}, {props.currentNumAnswers} submitted</h1>

                <div className={styles.question_options}>
                    {question.options.map((option, index) => {
                        return(
                            <div key={index} className={`${styles.mcq_option} ${option.correct && styles.mcq_option_correct}`}>
                                <h1 className={styles.mcq_option_title}>{option.option}</h1>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return(
        <div className={styles.question_background}>
            <h1 className={styles.question_title}>{question.question}, {props.currentNumAnswers} submitted</h1>

            <div className={styles.question_options}>
                {question.options.map((option, index) => {
                    return(
                        <div key={index} className={styles.mcq_option}>
                            <label className={styles.mcq_option_input_label}><input type='radio' name='mcq-option' className={styles.mcq_option_input} onChange={(e) => {
                                setSelectedOption(index);
                            }} checked={index === selectedOption} /><span /></label>
                            <h1 className={styles.mcq_option_title}>{option.option}</h1>
                        </div>
                    )
                })}
            </div>
            <button className={styles.submit_button} onClick={async () => {
                props.setSubmitted(true);
                await pushGameEvent(props.gameId, {
                    eventType: EventType.SubmitAnswer,
                    eventData: {},
                    eventId: generateId()
                });
            }}>Submit</button>
        </div>
    )
}