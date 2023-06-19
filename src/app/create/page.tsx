'use client'

import { useState } from 'react';
import styles from './page.module.css';
import Popup from '@/components/popup/popup';
import Loading from '@/components/loading/loading';
import { arrayUnion, collection, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '@baas/init';
import { useRouter } from 'next/navigation';
import useCurrentUser from '@hooks/useCurrentUser';

export default function CreatePage() {
    const router = useRouter();

    const [popup, setPopup] = useState(false);
    const [popupInfo, setPopupInfo] = useState('');
    const [loadingMenu, setLoadingMenu] = useState(false);
    const { currentUser, signedIn, loading } = useCurrentUser();

    const createQuiz = async () => {
        const newQuizRef = doc(collection(firestore, 'quizzes'));
        const newQuizId = newQuizRef.id;

        await setDoc(newQuizRef, {
            id: newQuizId,
            name: 'New Quiz',
            questions: [],
            numQuestions: 0,
            settings: {},
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            owner: currentUser.uid
        });

        const userRef = doc(collection(firestore, 'users', currentUser.uid));

        await updateDoc(userRef, {
             quizzes: arrayUnion(newQuizId)
        });

        return newQuizId;
    };

    if (loadingMenu || loading) {
        return(<Loading />);
    } else if (!signedIn) {
        return(<h1>Not signed in</h1>);
    }

    return(
        <div>
            <button className={styles.create_button} onClick={async () => {
                setLoadingMenu(true);
                const quizId = await createQuiz();
                router.push(`/edit/${quizId}`);
                setLoadingMenu(false);
            }}>Create Quiz</button>

            <Popup open={popup} setOpen={setPopup} exitButton >
                <p className={styles.popup_content}>{popupInfo}</p>
            </Popup>
        </div>
    );
}