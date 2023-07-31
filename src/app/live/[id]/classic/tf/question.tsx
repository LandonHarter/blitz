'use client'

import { Question } from '@/backend/set';

import styles from './question.module.css';
import { GameEvent, awardPoints, pushGameEvent } from '@/backend/live/game';
import { EventType } from '@/backend/live/events/event';
import generateId from '@/backend/id';
import { useContext } from 'react';
import { CorrectAnswerContext } from '../../correctanswercontext';
import AnswerBanner from '../../answer-banner/banner';
import ClientBaseQuestion from '../basequestion';
import { reportSubmission } from '@/backend/analyze';

export default function TFQuestion(props: { question: Question, uid: string, gameId: string, setSubmitted: Function, revealAnswer: boolean }) {
    const question = props.question;

    const correctContext = useContext(CorrectAnswerContext);

    const submitAnswer = async (optionIndex: number) => {
        if (props.revealAnswer) return;

        correctContext.set(question.options[optionIndex].correct);
        await pushGameEvent(props.gameId, {
            eventType: EventType.SubmitAnswer,
            eventData: {},
            eventId: generateId()
        });

        if (question.options[optionIndex].correct) {
            await awardPoints(props.gameId, props.uid, props.question.questionPoints || 100);
        }

        reportSubmission(props.gameId, question.options[optionIndex].option, question.tags || [], question.options[optionIndex].correct);

        props.setSubmitted(true);
    };

    if (props.revealAnswer) {
        return (
            <ClientBaseQuestion question={question}>
                <div className={styles.questions}>
                    <div className={`${styles.question_box} ${styles.question_red} ${question.options[0].correct ? styles.option_correct : styles.option_incorrect}`}>
                        <h1 className={styles.question_option}>True</h1>
                    </div>
                    <div className={`${styles.question_box} ${styles.question_blue} ${question.options[1].correct ? styles.option_correct : styles.option_incorrect}`}>
                        <h1 className={styles.question_option}>False</h1>
                    </div>
                </div>

                <AnswerBanner correct={correctContext.get} points={props.question.questionPoints || 100} />
            </ClientBaseQuestion>
        );
    }

    return (
        <ClientBaseQuestion question={question}>
            <div className={styles.questions}>
                <div className={`${styles.question_box} ${styles.question_red}`} onClick={() => {
                    submitAnswer(0);
                }}>
                    <h1 className={styles.question_option}>True</h1>
                </div>
                <div className={`${styles.question_box} ${styles.question_blue}`} onClick={() => {
                    submitAnswer(1);
                }}>
                    <h1 className={styles.question_option}>False</h1>
                </div>
            </div>
        </ClientBaseQuestion >
    )
}