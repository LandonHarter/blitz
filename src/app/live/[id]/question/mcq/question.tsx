'use client'

import { Question } from '@/backend/set';
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

    const colors: string[] = [styles.question_red, styles.question_blue, styles.question_green, styles.question_yellow];

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
                <div className={styles.questions} style={{
                    '--num-rows': Math.ceil(question.options.length / 2)
                } as React.CSSProperties}>
                    {question.options.map((option, index) => {
                        return (
                            <div className={`${styles.question_box} ${colors[index % colors.length]} ${option.correct ? styles.option_correct : styles.option_incorrect}`} key={index}>
                                <h1 className={styles.question_option}>{option.option}</h1>
                            </div>
                        )
                    })}
                </div>

                <AnswerBanner correct={correctAnswerContext.get} points={props.question.questionPoints || 100} />
            </ClientBaseQuestion>
        );
    }

    return (
        <ClientBaseQuestion question={question}>
            <div className={styles.questions} style={{
                '--num-rows': Math.ceil(question.options.length / 2)
            } as React.CSSProperties}>
                {question.options.map((option, index) => {
                    return (
                        <div className={`${styles.question_box} ${colors[index % colors.length]}`} onClick={() => {
                            submitAnswer(index);
                        }} key={index}>
                            <h1 className={styles.question_option}>{option.option}</h1>
                        </div>
                    );
                })}
            </div>
        </ClientBaseQuestion>
    )
}