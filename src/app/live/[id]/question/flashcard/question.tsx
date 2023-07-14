'use client'

import { Question } from '@/backend/live/set';
import { useContext, useState } from 'react';

import styles from './question.module.css';
import { GameEvent, awardPoints, pushGameEvent } from '@/backend/live/game';
import { EventType } from '@/backend/live/events/event';
import generateId from '@/backend/id';
import { CorrectAnswerContext } from '../../page';
import AnswerBanner from '../../answer-banner/banner';

export default function FlashcardQuestion(props: { question: Question, uid: string, gameId: string, setSubmitted: Function, revealAnswer: boolean }) {
    const question = props.question;
    const [response, setResponse] = useState<string>('');

    const correctContext = useContext(CorrectAnswerContext);

    const submitAnswer = async () => {
        if (props.revealAnswer) return;

        await pushGameEvent(props.gameId, {
            eventType: EventType.SubmitAnswer,
            eventData: {},
            eventId: generateId()
        });

        const answer: string = props.question.options[0].optionData.answer;
        const correct: boolean = answer.toLowerCase() === response.toLowerCase();
        if (correct) {
            await awardPoints(props.gameId, props.uid, 1000);
        }

        props.setSubmitted(true);
    };

    if (props.revealAnswer) {
        return (
            <div>
                <AnswerBanner correct={correctContext.get} />
            </div>
        );
    }

    return (
        <div className={styles.question_container}>
            <div className={styles.top_bar}>
                <h1 className={styles.question_title}>{question.question}</h1>
            </div>

            <div className={styles.bottom_bar}>

            </div>
        </div>
    )
}