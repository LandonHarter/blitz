'use client'

import styles from './question.module.css';
import { Question } from '@/backend/set';
import BaseHostQuestion from '../basequestion';

export default function HostFlashcardQuestion(props: { question: Question, revealAnswer: () => Promise<void> }) {
    return (
        <BaseHostQuestion question={props.question} revealAnswer={props.revealAnswer}>

        </BaseHostQuestion>
    );
}