'use client'

import { Question } from '@/backend/live/set';
import { useContext, useEffect, useState } from 'react';
import styles from './question.module.css';
import { GameEvent, awardPoints, pushGameEvent } from '@/backend/live/game';
import { EventType } from '@/backend/live/events/event';
import generateId from '@/backend/id';
import AnswerBanner from '../../answer-banner/banner';
import { CorrectAnswerContext } from '../../correctanswercontext';
import ClientBaseQuestion from '../basequestion';

export default function MCQuestion(props: { question: Question, uid: string, gameId: string, setSubmitted: Function, revealAnswer: boolean }) {
    const question = props.question;

    const correctAnswerContext = useContext(CorrectAnswerContext);

    const submitAnswer = async (optionIndex: number) => {
        if (props.revealAnswer) return;
        correctAnswerContext.set(question.options[optionIndex].correct);

        await pushGameEvent(props.gameId, {
            eventType: EventType.SubmitAnswer,
            eventData: {},
            eventId: generateId()
        });

        if (question.options[optionIndex].correct) {
            await awardPoints(props.gameId, props.uid, props.question.questionPoints || 100);
        }

        props.setSubmitted(true);
    };

    if (props.revealAnswer) {
        return (
            <ClientBaseQuestion question={question}>
                <div className={styles.questions}>
                    <div className={`${styles.question_box} ${styles.question_red} ${question.options[0].correct ? styles.option_correct : styles.option_incorrect}`}>
                        <h1 className={styles.question_option}>{question.options[0].option}</h1>
                    </div>
                    <div className={`${styles.question_box} ${styles.question_blue} ${question.options[1].correct ? styles.option_correct : styles.option_incorrect}`}>
                        <h1 className={styles.question_option}>{question.options[1].option}</h1>
                    </div>
                    <div className={`${styles.question_box} ${styles.question_green} ${question.options[2].correct ? styles.option_correct : styles.option_incorrect}`}>
                        <h1 className={styles.question_option}>{question.options[2].option}</h1>
                    </div>
                    <div className={`${styles.question_box} ${styles.question_yellow} ${question.options[3].correct ? styles.option_correct : styles.option_incorrect}`}>
                        <h1 className={styles.question_option}>{question.options[3].option}</h1>
                    </div>
                </div>

                <AnswerBanner correct={correctAnswerContext.get} points={props.question.questionPoints || 100} />
            </ClientBaseQuestion>
        );
    }

    return (
        <ClientBaseQuestion question={question}>
            <div className={styles.questions}>
                <div className={`${styles.question_box} ${styles.question_red}`} onClick={() => {
                    submitAnswer(0);
                }}>
                    <h1 className={styles.question_option}>{question.options[0].option}</h1>
                </div>
                <div className={`${styles.question_box} ${styles.question_blue}`} onClick={() => {
                    submitAnswer(1);
                }}>
                    <h1 className={styles.question_option}>{question.options[1].option}</h1>
                </div>
                <div className={`${styles.question_box} ${styles.question_green}`} onClick={() => {
                    submitAnswer(2);
                }}>
                    <h1 className={styles.question_option}>{question.options[2].option}</h1>
                </div>
                <div className={`${styles.question_box} ${styles.question_yellow}`} onClick={() => {
                    submitAnswer(3);
                }}>
                    <h1 className={styles.question_option}>{question.options[3].option}</h1>
                </div>
            </div>
        </ClientBaseQuestion>
    )
}