'use client'

import styles from './page.module.css';

const { useContext, useEffect, useState } = require('react');
import UserContext from '@/context/usercontext';
import { useRouter, usePathname } from 'next/navigation';
import { collection, doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/backend/firebase/init';
import { Question, getSet } from '@/backend/live/set';
import Loading from '@/components/loading/loading';
import Popup from '@/components/popup/popup';
import Image from 'next/image';
import FlashcardStudyMethod from './methods/flashcards/flashcard';
import { AnimatePresence } from 'framer-motion';

export default function StudyContent() {
    const id = usePathname().split('/')[2];
    const router = useRouter();

    const { currentUser, signedIn, userLoading } = useContext(UserContext);

    const [set, setSet] = useState();
    const [author, setAuthor] = useState();
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');
    const [errorOpen, setErrorOpen] = useState(false);

    const [studyMethod, setStudyMethod] = useState('flashcards');

    const getStudyMethodUI = () => {
        switch (studyMethod) {
            case 'flashcards':
                return (<FlashcardStudyMethod set={set} />);
            default:
                return (<></>);
        }

        return (<></>);
    }

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
    }, []);

    if (loading || !set) {
        return <Loading />;
    }

    return (
        <div>
            <h1 className={styles.study_title}>Choose a Study Method</h1>
            <div className={styles.study_methods}>
                <button className={`${styles.study_method} ${studyMethod === 'flashcards' && styles.study_method_selected}`} onClick={() => {
                    setStudyMethod('flashcards');
                }}><Image src='/images/icons/study/flashcards2.png' alt='icon' width={40} height={40} />Flashcards</button>
            </div>

            <div className={styles.study_method_container}>
                <AnimatePresence mode='wait'>{getStudyMethodUI()}</AnimatePresence>
            </div>

            <Popup open={errorOpen} setOpen={setErrorOpen} exitButton>
                <Image src='/images/icons/error.png' alt='error' width={60} height={60} style={{ marginBottom: 25 }} />
                <h1 className={styles.popup_error}>{error}</h1>
            </Popup>
        </div>
    );
}