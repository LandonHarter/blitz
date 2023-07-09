'use client'

import { useContext, useEffect, useState } from 'react';

import styles from './page.module.css';
import Loading from '@/components/loading/loading';
import BasicReturn from '@/components/basic-return/return';
import NeedSignin from '@/components/require-signin/needsignin';
import { doc, collection, getDoc } from 'firebase/firestore';
import { firestore } from '@baas/init';
import Link from 'next/link';
import UserContext from '@/context/usercontext';
import { useRouter } from 'next/navigation';
import { createGame } from '@/backend/live/game';
import Popup from '@/components/popup/popup';
import Image from 'next/image';

export default function MySetsPage() {
    const router = useRouter();
    const [sets, setSets] = useState<any[]|null>(null);

    const { currentUser, userLoading, signedIn } = useContext(UserContext);
    const [loading, setLoading] = useState(true);

    const [errorOpen, setErrorOpen] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        console.error(error);
    }, [error]);

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
        <div className={styles.sets}>
            {sets.map((set, index) => {
                return(
                    <article key={index} className={styles.set_card}>
                            <div className={styles.article_wrapper}>
                                <figure style={{ backgroundImage: `url(${set.image})` }}>
                                    
                                </figure>
                                <div className={styles.article_body}>
                                    <Link href={`/set/${set.id}`} className={styles.link_decoration}><h2 onClick={() => {
                                    }}>{set.name}</h2></Link>
                                    <p>{set.description}</p>
                                </div>
                                <div className={styles.card_footer}>
                                    <div />
                                    <button onClick={async () => {
                                        if (!signedIn) {
                                            setError('You must be signed in to host a live game.');
                                            setErrorOpen(true);
                                            return;
                                        }

                                        setLoading(true);
                                        const {
                                            success,
                                            error,
                                            gameCode
                                        } = await createGame(currentUser.uid, set.id);
                                        
                                        if (success) {
                                            router.push(`/host/${gameCode}`);
                                        } else {
                                            setError(error);
                                            setErrorOpen(true);
                                            setLoading(false);
                                        }
                                    }}>Host Live</button>
                                </div>
                            </div>
                        </article>
                );
            })}

            <Popup open={errorOpen} setOpen={setErrorOpen} exitButton>
                <Image src='/images/icons/error.png' alt='error' width={60} height={60} style={{ marginBottom:25 }} />
                <p className={styles.popup_content}>{error}</p>
            </Popup>
        </div>
    );
}