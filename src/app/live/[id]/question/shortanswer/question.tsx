'use client'

import { Question } from '@/backend/live/set';
import { useContext, useState } from 'react';

import styles from './question.module.css';
import { GameEvent, awardPoints, pushGameEvent } from '@/backend/live/game';
import { EventType } from '@/backend/live/events/event';
import generateId from '@/backend/id';
import { CorrectAnswerContext } from '../../correctanswercontext';
import AnswerBanner from '../../answer-banner/banner';
import ClientBaseQuestion from '../basequestion';

export default function ShortAnswerQuestion(props: { question: Question, uid: string, gameId: string, setSubmitted: Function, revealAnswer: boolean }) {
    const question = props.question;
    const [response, setResponse] = useState<string>('');

    const correctAnswer = useContext(CorrectAnswerContext);

    const submitAnswer = async () => {
        if (props.revealAnswer) return;

        await pushGameEvent(props.gameId, {
            eventType: EventType.SubmitAnswer,
            eventData: {},
            eventId: generateId()
        });

        const correctAnswers: string[] = question.options[0].optionData.correctAnswers;
        for (let i = 0; i < correctAnswers.length; i++) {
            if (response.toLowerCase().includes(correctAnswers[i].toLowerCase())) {
                correctAnswer.set(true);

                await awardPoints(props.gameId, props.uid, 1000);
                break;
            }
        }

        props.setSubmitted(true);
    };

    if (props.revealAnswer) {
        return (
            <ClientBaseQuestion question={question}>
                <h1 className={styles.reveal_title}>Look to the host screen to see accepted answers!</h1>
                <AnswerBanner correct={correctAnswer.get} />
            </ClientBaseQuestion>
        );
    }

    return (
        <ClientBaseQuestion question={question}>
            <input placeholder='Type a response' className={styles.response_input} value={response} onChange={(e) => {
                setResponse(e.target.value);
            }} maxLength={100} />
            <button className={styles.submit_button} onClick={() => {
                submitAnswer();
            }}>Submit</button>
        </ClientBaseQuestion>
    )
}