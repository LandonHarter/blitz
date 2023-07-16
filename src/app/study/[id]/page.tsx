'use client'

import styles from './page.module.css';

const { useContext, useEffect, useState } = require('react');
import UserContext from '@/context/usercontext';
import { useRouter, usePathname } from 'next/navigation';
import { collection, doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/backend/firebase/init';
import { Question, Set } from '@/backend/live/set';
import Loading from '@/components/loading/loading';

export default function StudyPage() {
    const id = usePathname().split('/')[2];
    const router = useRouter();

    const { currentUser, signedIn, userLoading } = useContext(UserContext);

    const [set, setSet] = useState();
    const [author, setAuthor] = useState();
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');
    const [errorOpen, setErrorOpen] = useState(false);

    useEffect(() => {
        if (!id) {
            router.push('/');
            return;
        }

        (async () => {
            const setRef = doc(collection(firestore, 'sets'), id);
            const setData = await getDoc(setRef);

            if (!setData.exists()) {
                router.push('/');
                return;
            }

            const set = setData.data();
            setSet({
                id: setData.id,
                name: set.name,
                description: set.description,
                image: set.image,
                questions: set.questions as Question[],
                likes: set.likes,
                numQuestions: set.numQuestions,
                createdAt: set.createdAt,
                updatedAt: set.updatedAt,
                public: set.public,
            });

            const authorRef = doc(collection(firestore, 'users'), set.owner);
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
            {set.name}
        </div>
    );
}