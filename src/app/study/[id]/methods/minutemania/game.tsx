'use client'

import StudyMethodContainer from "../studymethod";
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import styles from './game.module.css';
import Popup from "@/components/popup/popup";
import { QuestionType } from "@/backend/set";
import { motion } from "framer-motion";
import Image from "next/image";
import { StudyMethod, getStudyData, updateStudyData } from "@/backend/firebase/study";
import UserContext from "@/context/usercontext";
import RequireSignInStudyMethod from "../needsignin";
import { analyzeStruggles, clearSubmissionData, reportSubmission } from "@/backend/analyze";

export default function MinuteManiaStudyMethod(props: { set: any, studyData: any, setStudyData: Dispatch<SetStateAction<any>> }) {
    const [currentQuestion, setCurrentQuestion] = useState<any>();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(5);
    const [gameState, setGameState] = useState('pregame');
    const [isHighscore, setIsHighscore] = useState(false);
    const [correctIndicator, setCorrectIndicator] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const { currentUser } = useContext(UserContext);

    const gameLength = 60;
    const backgroundColors = ['#C60929', '#0542B9', '#106B03', '#D89E00'];

    useEffect(() => {
        (async () => {
            if (gameState === 'endgame') {
                if (score > props.studyData.highscore) {
                    await updateStudyData(props.set.id, StudyMethod.MinuteMania, currentUser.uid, { highscore: score });
                    props.setStudyData({
                        ...props.studyData,
                        minutemania: {
                            ...props.studyData.minutemania,
                            highscore: score,
                        }
                    });
                    setIsHighscore(true);
                }
            }
        })();
    }, [gameState, score]);

    const startTimer = async (numSeconds: number) => {
        setTimer(numSeconds);

        for (let i = 0; i < numSeconds; i++) {
            await tickSecond();
            setTimer(timer - 1);
        }

        timerFinish();
    };

    const tickSecond = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
    };

    const timerFinish = () => {
        setGameState('endgame');
    };

    const getNextQuestion: any = (index: number, recursive?: boolean) => {
        const questions = props.set.questions;

        let i = index;
        while (true) {
            if (i >= questions.length) {
                if (recursive) break;
                return getNextQuestion(0, true);
            }

            if (questions[i].type !== QuestionType.ShortAnswer &&
                questions[i].type !== QuestionType.Flashcard
            ) {
                return i;
            }

            i++;
        }

        return -1;
    };

    const resetGame = () => {
        setGameState('pregame');
        setScore(0);
        setIsHighscore(false);
    };

    if (props.set.questions.length === 0 || currentQuestionIndex === -1) {
        return (
            <StudyMethodContainer>
                <div className={styles.no_questions}>
                    <h1>There are no questions in this set!</h1>
                </div>
            </StudyMethodContainer>
        );
    }

    return (
        <StudyMethodContainer>
            {gameState === 'pregame' &&
                <>
                    <div className={styles.question_container}>
                        <div className={styles.question_top}>
                            <h1 className={styles.question_title}>Minute Mania!</h1>
                        </div>
                        <div className={styles.timer_loading} />
                        <div className={styles.question_bottom}>
                            <div className={styles.option_loading} />
                            <div className={styles.option_loading} />
                            <div className={styles.option_loading} />
                            <div className={styles.option_loading} />
                        </div>
                    </div>

                    <Popup open={gameState === 'pregame'} setOpen={() => { }} exitButton={false} closeOnOutsideClick={false}>
                        <h1 className={styles.pregame_title}>Minute Mania!</h1>
                        <p className={styles.pregame_subtitle}>Answer as many questions as you can in 60 seconds!</p>
                        <button className={styles.start_game_button} onClick={() => {
                            clearSubmissionData();
                            setGameState('game');

                            const newIndex = getNextQuestion(0);
                            setCurrentQuestionIndex(newIndex);
                            setCurrentQuestion(props.set.questions[newIndex]);

                            startTimer(gameLength);
                        }}>Start</button>
                    </Popup>
                </>
            }
            {gameState === 'game' &&
                <div className={styles.question_container}>
                    <motion.div className={styles.correct_indicator} initial={{ opacity: 0 }} animate={{ opacity: correctIndicator ? 1 : 0 }} transition={{ duration: 0.1 }}>
                        <Image src={isCorrect ? '/images/icons/check.png' : '/images/icons/error.png'} alt="" width={75} height={75} />
                        <h1>{isCorrect ? 'Correct!' : 'Nope, try again!'}</h1>
                    </motion.div>

                    <div className={styles.question_top}>
                        <h1 className={styles.question_title} style={{
                            marginTop: currentQuestion.photo ? 0 : 30
                        }}>{currentQuestion.question}</h1>
                        {currentQuestion.photo && <div className={styles.question_photo} style={{ backgroundImage: `url('${currentQuestion.photo}'` }} />}
                    </div>
                    <div className={styles.timer}>
                        <motion.div initial={{ transform: 'scaleX(1)' }} animate={{ transform: 'scaleX(0)' }} transition={{ duration: gameLength, ease: 'linear' }} className={styles.timer_bar} />
                    </div>
                    <div className={styles.question_bottom}>
                        {currentQuestion.options.map((option: any, index: number) => {
                            return (
                                <div key={index} className={styles.option} style={{
                                    backgroundColor: backgroundColors[index % backgroundColors.length]
                                }} onClick={() => {
                                    if (option.correct) {
                                        reportSubmission(option, currentQuestion.tags, option.correct);

                                        setScore(score + 1);
                                        setIsCorrect(true);

                                        setTimeout(() => {
                                            const newIndex = getNextQuestion(currentQuestionIndex + 1);
                                            setCurrentQuestionIndex(newIndex);
                                            setCurrentQuestion(props.set.questions[newIndex]);
                                        }, 150);
                                    } else {
                                        reportSubmission(option, currentQuestion.tags, option.correct);
                                        setIsCorrect(false);
                                    }

                                    setCorrectIndicator(true);
                                    setTimeout(() => {
                                        setCorrectIndicator(false);
                                    }, 500);
                                }}>
                                    <h1>{option.option}</h1>
                                </div>
                            );
                        })}
                    </div>
                </div>
            }
            {gameState === 'endgame' &&
                <>
                    <div className={styles.question_container}>
                        <div className={styles.question_top}>
                            <h1 className={styles.question_title}>Minute Mania!</h1>
                        </div>
                        <div className={styles.timer_loading} />
                        <div className={styles.question_bottom}>
                            <div className={styles.option_loading} />
                            <div className={styles.option_loading} />
                            <div className={styles.option_loading} />
                            <div className={styles.option_loading} />
                        </div>
                    </div>

                    <Popup open={gameState === 'endgame'} setOpen={() => { }} exitButton={false} closeOnOutsideClick={false}>
                        <h1 className={styles.pregame_title}>{score}</h1>
                        <p className={styles.pregame_subtitle}>{isHighscore ? 'You just set a new highscore!' : 'You did fantastic! Next time try to beat your high score!'}</p>
                        <button className={styles.start_game_button} onClick={() => {
                            resetGame();
                        }}>Study Again</button>
                        <button className={styles.start_game_button} onClick={() => {
                            window.open(`/analyze?reportData=${JSON.stringify(analyzeStruggles())}&game=minutemania`, '_blank');
                        }} style={{ marginTop: 15 }}>View Report</button>
                        <div style={{ marginBottom: 20 }} />
                    </Popup>
                </>
            }
        </StudyMethodContainer>
    );
}