'use client'

import { useContext, useEffect, useState } from 'react';

import styles from './page.module.css';
import Loading from '@/components/loading/loading';
import BasicReturn from '@/components/basic-return/return';
import useCurrentUser from '@/hooks/useCurrentUser';
import NeedSignin from '@/components/require-signin/needsignin';
import { doc, collection, getDoc } from 'firebase/firestore';
import { firestore } from '@baas/init';
import UserContext from '@/context/usercontext';

export default function MySetsPage() {
    const [sets, setSets] = useState<any[]|null>(null);

    const { currentUser, userLoading, signedIn } = useContext(UserContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!signedIn) {
            setLoading(false);
            return;
        }

        (async () => {
            const userRef = doc(collection(firestore, 'users'), currentUser.uid);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                setLoading(false);
                return;
            }

            const userData = userDoc.data();
            const userSets = userData.sets;

            if (userSets === undefined) {
                setLoading(false);
                return;
            }

            setSets(userSets);
        })();
    }, [signedIn]);

    if (!signedIn) {
        return(<NeedSignin />);
    } else if (loading || userLoading || !sets) {
        return(<Loading />);
    }

    if (sets && sets.length === 0) {
        return(<BasicReturn text='No sets available' returnLink='/' />)
    }

    return(
        <div>
            {sets.map((set, index) => {
                return(
                    <h1 key={index}>{set.name}</h1>
                );
            })}
        </div>
    );
}