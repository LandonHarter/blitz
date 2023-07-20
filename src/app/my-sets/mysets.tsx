'use client'

import { useContext, useEffect, useState } from 'react';

import styles from './page.module.css';
import Loading from '@/components/loading/loading';
import BasicReturn from '@/components/basic-return/return';
import NeedSignin from '@/components/require-signin/needsignin';
import { doc, collection, getDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '@baas/init';
import Link from 'next/link';
import UserContext from '@/context/usercontext';
import { useRouter } from 'next/navigation';
import { createGame } from '@/backend/live/game';
import Popup from '@/components/popup/popup';
import Image from 'next/image';

export default function MySetsContent() {
    const router = useRouter();
    const [sets, setSets] = useState<any[] | null>(null);

    const [setsOverflowing, setSetsOverflowing] = useState(true);
    const [maxOverflow, setMaxOverflow] = useState<number>(0);
    const [sortedRecentlySets, setSortedRecentlySets] = useState<any[]>([]);

    const [setTranslation, setSetTranslation] = useState<number>(0);
    const transformStep = 450;

    const [search, setSearch] = useState<string>('');
    const [filteredSets, setFilteredSets] = useState<any[]>([]);

    const { currentUser, userLoading, signedIn } = useContext(UserContext);
    const [loading, setLoading] = useState(true);

    const [errorOpen, setErrorOpen] = useState(false);
    const [error, setError] = useState('');

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

            const alphabeticalSets: any[] = userSets;
            alphabeticalSets.sort((a: any, b: any) => {
                const aName: string = a.name.toLowerCase();
                const bName: string = b.name.toLowerCase();

                if (aName < bName) {
                    return -1;
                } else if (aName > bName) {
                    return 1;
                } else {
                    return 0;
                }
            });
            setSets(alphabeticalSets);

            const recentSets: any[] = userSets;
            recentSets.sort((a: any, b: any) => {
                const aUpdatedAt: Timestamp = a.updatedAt;
                const bUpdatedAt: Timestamp = b.updatedAt;

                if (aUpdatedAt.seconds > bUpdatedAt.seconds) {
                    return -1;
                } else if (aUpdatedAt.seconds < bUpdatedAt.seconds) {
                    return 1;
                } else {
                    return 0;
                }
            }).slice(0, 10);
            setSortedRecentlySets(recentSets);

            const windowWidth = window.innerWidth;
            const setsWidth = recentSets.length * transformStep;
            if (setsWidth < windowWidth) {
                setSetsOverflowing(false);
            } else {
                setSetsOverflowing(true);
                setMaxOverflow(setsWidth - windowWidth);
            }

            window.onresize = () => {
                const windowWidth = window.innerWidth;
                const setsWidth = recentSets.length * transformStep;
                if (setsWidth < windowWidth) {
                    setSetsOverflowing(false);
                } else {
                    setSetsOverflowing(true);
                    setMaxOverflow(setsWidth - windowWidth);
                }
            };

            setLoading(false);
        })();
    }, [signedIn]);

    if (!signedIn) {
        return (<NeedSignin />);
    } else if (loading || userLoading || !sets) {
        return (<Loading />);
    }

    if (sets && sets.length === 0) {
        return (<BasicReturn text='No sets available' returnLink='/' />)
    }

    return (
        <div>
            <h1 className={styles.your_sets_title}>Recently Updated</h1>
            <div className={styles.set_carousel}>
                {setsOverflowing && <div className={`${styles.move_left} ${!setsOverflowing ? styles.move_button_disabled : styles.move_button_active}`} onClick={() => {
                    if (!setsOverflowing || -setTranslation <= 0) return;
                    setSetTranslation((prevTranslation) => { return prevTranslation + transformStep });
                }}><p>➜</p></div>}

                <div className={styles.sets} style={{ transform: `translateX(${setTranslation}px)` }}>
                    {sortedRecentlySets.map((set, index) => {
                        if (index > 9) return;
                        return (
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
                                        <div>
                                            <Link href={`/edit/${set.id}`}><button className={styles.edit_button}>Edit</button></Link>
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
                                </div>
                            </article>
                        );
                    })}
                </div>

                {setsOverflowing && <div className={`${styles.move_right} ${!setsOverflowing ? styles.move_button_disabled : styles.move_button_active}`} onClick={() => {
                    if (!setsOverflowing || -setTranslation > maxOverflow) return;
                    setSetTranslation((prevTranslation) => { return prevTranslation - transformStep });
                }}><p>➜</p></div>}
            </div>

            <div className={styles.divider} />

            <h1 className={styles.your_sets_title}>All Sets ({sets.length})</h1>
            <input className={styles.search_sets} placeholder='Search' value={search} onChange={(e) => {
                setSearch(e.target.value);
                if (e.target.value === '') return;

                let newFilter = sets;
                newFilter = newFilter.filter((set) => {
                    return set.name.toLowerCase().includes(e.target.value.toLowerCase());
                });
                setFilteredSets(newFilter);
            }} />
            <div className={styles.all_sets}>
                {(search === '' ? sets : filteredSets).map((set, index) => {
                    return (
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
                                    <div>
                                        <Link href={`/edit/${set.id}`}><button className={styles.edit_button}>Edit</button></Link>
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
                            </div>
                        </article>
                    );
                })}
            </div>

            <Popup open={errorOpen} setOpen={setErrorOpen} exitButton>
                <Image src='/images/icons/error.png' alt='error' width={60} height={60} style={{ marginBottom: 25 }} />
                <p className={styles.popup_error}>{error}</p>
            </Popup>
        </div>
    );
}