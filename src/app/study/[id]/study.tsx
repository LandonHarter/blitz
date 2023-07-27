'use client'

import styles from './page.module.css';

import { useEffect, useState, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { collection, doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/backend/firebase/init';
import { getSet } from '@/backend/set';
import UserContext from '@/context/usercontext';
import Loading from '@/components/loading/loading';
import Popup from '@/components/popup/popup';
import Image from 'next/image';
import FlashcardStudyMethod from './methods/flashcards/flashcard';
import { AnimatePresence } from 'framer-motion';
import MinuteManiaStudyMethod from './methods/minutemania/game';
import StudyTimer from './studytimer';
import { getStudyData } from '@/backend/firebase/study';

export default function StudyContent() {
    const id = usePathname().split('/')[2];
    const router = useRouter();

    const { currentUser, signedIn } = useContext(UserContext)

    const [set, setSet] = useState();
    const [author, setAuthor] = useState();
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');
    const [errorOpen, setErrorOpen] = useState(false);

    const [studyMethod, setStudyMethod] = useState('flashcards');
    const [studyData, setStudyData] = useState<any>();

    const studyTimerLengthSeconds = 25 * 60;
    const [studyTimer, setStudyTimer] = useState(false);
    const [studyState, setStudyState] = useState('studying');

    const getStudyMethodUI = () => {
        switch (studyMethod) {
            case 'flashcards':
                return (<FlashcardStudyMethod set={set} />);
            case 'minute-mania':
                return (<MinuteManiaStudyMethod set={set} studyData={studyData.minutemania || {
                    highscore: 0,
                }} setStudyData={setStudyData} />)
            default:
                return (<></>);
        }
    }

    const startStudyTimer = () => {
        setTimeout(() => {
            setStudyTimer(true);
            setStudyState('needbreak');
        }, studyTimerLengthSeconds * 1000);
    };

    useEffect(() => {
        if (!id) {
            router.push('/');
            return;
        }

        (async () => {
            const setData = await getSet(id);
            if (!setData) {
                router.push('/');
                return;
            }

            setSet(setData);

            const authorRef = doc(collection(firestore, 'users'), setData.owner);
            const authorData = await getDoc(authorRef);

            if (!authorData.exists()) {
                router.push('/');
                return;
            }

            setAuthor({
                id: authorData.id,
                name: authorData.data().name,
                image: authorData.data().image,
            });

            setLoading(false);
        })();

        startStudyTimer();
    }, []);

    useEffect(() => {
        if (signedIn) {
            (async () => {
                const userStudyData = await getStudyData(id, currentUser.uid);
                if (userStudyData) {
                    setStudyData(userStudyData);
                } else {
                    setStudyData(undefined);
                }
            })();
        }
    }, [signedIn]);

    if (loading || !set) {
        return <Loading />;
    }

    return (
        <div>
            <h1 className={styles.study_title}>Study Methods</h1>
            <div className={styles.study_methods}>
                <button className={`${styles.study_method} ${studyMethod === 'flashcards' && styles.study_method_selected}`} onClick={() => {
                    setStudyMethod('flashcards');
                }}><Image src='/images/icons/study/flashcards2.png' alt='icon' width={40} height={40} />Flashcards</button>
                <button className={`${styles.study_method} ${studyMethod === 'minute-mania' && styles.study_method_selected}`} onClick={() => {
                    setStudyMethod('minute-mania');
                }}><Image src='/images/icons/study/minute-mania.png' alt='icon' width={40} height={40} />Minute Mania</button>
            </div>

            <div className={styles.study_method_container}>
                <AnimatePresence mode='wait'>{getStudyMethodUI()}</AnimatePresence>
            </div>

            <Popup open={errorOpen} setOpen={setErrorOpen} exitButton>
                <Image src='/images/icons/error.png' alt='error' width={60} height={60} style={{ marginBottom: 25 }} />
                <h1 className={styles.popup_error}>{error}</h1>
            </Popup>

            <Popup open={studyTimer} setOpen={setStudyTimer} exitButton={false} closeOnOutsideClick={false}>
                <div style={{ marginTop: 15 }} />
                <StudyTimer setOpen={setStudyTimer} studyState={studyState} setStudyState={setStudyState} startStudyTimer={startStudyTimer} />
                <div style={{ marginBottom: 15 }} />
            </Popup>
        </div>
    );
}