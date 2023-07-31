'use client'

import { Question } from '@/backend/set';
import styles from './question.module.css';
import BaseHostRevealedQuestion from '../baserevealedquestion';

export default function HostRevealedFlashcardQuestion(props: { question: Question, nextQuestion: () => Promise<void> }) {
    return (
        <BaseHostRevealedQuestion question={props.question} nextQuestion={props.nextQuestion}>

        </BaseHostRevealedQuestion >
    );
}