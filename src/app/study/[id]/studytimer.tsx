'use client'

import { Dispatch, SetStateAction, useState } from 'react';
import styles from './page.module.css';

export default function StudyTimer(props: { setOpen: Dispatch<SetStateAction<boolean>>, studyState: string, setStudyState: Dispatch<SetStateAction<string>>, startStudyTimer: () => void }) {
    const [stopBreak, setStopBreak] = useState(false);
    const [breakTimeLeft, setBreakTimeLeft] = useState(300);

    const takeBreak = async () => {
        let left = breakTimeLeft;
        for (let i = 0; i < 300; i++) {
            if (stopBreak) {
                setStopBreak(false);
                setBreakTimeLeft(300);
                return;
            }

            await waitSecond();

            left--;
            setBreakTimeLeft(left);
        }

        setBreakTimeLeft(300);
        props.setStudyState('breakover');
    }

    const waitSecond = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const formatTimer = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secondsLeft = seconds % 60;

        return `${minutes}:${secondsLeft < 10 ? '0' + secondsLeft : secondsLeft}`;
    }

    const getUI = () => {
        if (props.studyState === 'needbreak') {
            return (
                <>
                    <h1 className={styles.study_state_title}>You have studied for 25 minutes!</h1>
                    <h2 className={styles.study_state_subtitle}>We recommend you take a 5 minute break.</h2>

                    <button className={styles.take_break} onClick={() => {
                        props.setStudyState('break');
                        takeBreak();
                    }}>Take Break</button>
                    <button className={styles.ignore_break} onClick={() => {
                        props.setStudyState('studying');
                        props.setOpen(false);
                        props.startStudyTimer();
                    }}>Ignore</button>
                </>
            )
        } else if (props.studyState === 'break') {
            return (
                <>
                    <h1 className={styles.timer}>{formatTimer(breakTimeLeft)}</h1>
                    <button className={styles.take_break} onClick={() => {
                        props.setStudyState('studying');
                        props.setOpen(false);
                        props.startStudyTimer();
                        setStopBreak(true);
                        setBreakTimeLeft(300);
                    }}>End Break</button>
                </>
            );
        } else if (props.studyState === 'breakover') {
            return (
                <>
                    <h1 className={styles.study_state_title}>Your break is over!</h1>
                    <button className={styles.take_break} onClick={() => {
                        props.setStudyState('studying');
                        props.setOpen(false);
                        props.startStudyTimer();
                    }}>Continute Studying</button>
                </>
            );
        }

        return (<></>);
    };

    return getUI();
}