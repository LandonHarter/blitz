'use client'

import { Question } from '@/backend/set';
import { useContext, useState } from 'react';

import styles from './question.module.css';
import { GameEvent, awardPoints, pushGameEvent } from '@/backend/live/game';
import { EventType } from '@/backend/live/events/event';
import generateId from '@/backend/id';
import { CorrectAnswerContext } from '../../correctanswercontext';
import AnswerBanner from '../../answer-banner/banner';
import ClientBaseQuestion from '../basequestion';
import { reportSubmission } from '@/backend/analyze';

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
            await awardPoints(props.gameId, props.uid, props.question.questionPoints || 100);
        }

        reportSubmission(props.gameId, response, question.tags || [], correct);

        props.setSubmitted(true);
    };

    if (props.revealAnswer) {
        return (
            <ClientBaseQuestion question={question}>
                <AnswerBanner correct={correctContext.get} points={props.question.questionPoints || 100} />
            </ClientBaseQuestion>
        );
    }

    return (
        <ClientBaseQuestion question={question}>

        </ClientBaseQuestion>
    )
}