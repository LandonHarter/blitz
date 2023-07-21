'use client'

import { useEffect, useState } from "react";
import StudyMethodContainer from "../studymethod";
import { QuestionType } from "@/backend/live/set";
import Flashcard from "./card";
import styles from './flashcard.module.css';

export default function FlashcardStudyMethod(props: { set: any }) {
    const [flashcards, setFlashcards] = useState<{
        question: string,
        answer: string
    }[]>([]);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        if (!props.set) return;

        const questions = props.set.questions;
        const flashcards = [];

        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            const questionType = question.type;

            if (questionType === QuestionType.Flashcard) {
                flashcards.push({
                    question: question.question,
                    answer: question.options[0].optionData.answer
                });
            } else if (questionType === QuestionType.MultipleChoice) {
                const correctOption = question.options.find((option: any) => option.correct);
                flashcards.push({
                    question: question.question,
                    answer: correctOption.option
                });
            } else if (questionType === QuestionType.TrueFalse) {
                const correctOption = question.options.find((option: any) => option.correct);
                flashcards.push({
                    question: question.question,
                    answer: correctOption.option
                });
            } else if (questionType === QuestionType.ShortAnswer) {
                let correctAnswers: string[] = question.options[0].optionData.correctAnswers;
                let answer = '';
                correctAnswers.forEach((correctAnswer: string, index: number) => {
                    answer += correctAnswer;
                    if (index !== correctAnswers.length - 1) answer += ', ';
                });

                flashcards.push({
                    question: question.question,
                    answer: answer
                });
            }
        }

        setFlashcards(flashcards);
    }, []);

    if (flashcards.length === 0) {
        return (
            <StudyMethodContainer>
                <div className={styles.no_questions}>
                    <h1>There are no questions in this set!</h1>
                </div>
            </StudyMethodContainer>
        );
    }

    if (offset + 1 > flashcards.length) {
        return (
            <StudyMethodContainer>
                <div className={styles.end_of_set}>
                    <h1>End of Set</h1>
                    <button onClick={() => {
                        setOffset(0);
                    }}>Study Again</button>
                </div>
            </StudyMethodContainer>
        );
    }

    return (
        <StudyMethodContainer>
            <div className={styles.flashcard_container}>
                {flashcards.map((flashcard, index) => {
                    if (index < offset || index > 2 + offset) return;

                    return <Flashcard question={flashcard.question} answer={flashcard.answer} index={index - offset} key={index} />
                })}
            </div>
            <div className={styles.flashcard_operations}>
                <button className={styles.flashcard_operations_button} onClick={() => {
                    if (offset - 1 < 0) {
                        setOffset(flashcards.length - 1);
                        return;
                    }

                    setOffset(offset - 1);
                }}><p style={{ transform: 'rotateZ(180deg)' }}>➜</p></button>
                <button className={styles.flashcard_operations_button} onClick={() => {
                    if (offset + 1 > flashcards.length) {
                        return;
                    }

                    setOffset(offset + 1);
                }}><p style={{ transform: 'translateY(-1px)' }}>➜</p></button>
            </div>
        </StudyMethodContainer>
    );
}