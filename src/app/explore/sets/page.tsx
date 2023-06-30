'use client'

import React, { useEffect, useState } from "react";

import styles from "./page.module.css";
import Loading from "@/components/loading/loading";
import { query, collection, orderBy, limit, getDocs, where, Timestamp } from "firebase/firestore";
import { firestore } from "@/backend/firebase/init";
import { createGame } from "@/backend/live/game";
import { useRouter } from "next/navigation";
import Popup from "@/components/popup/popup";
import useCurrentUser from "@/hooks/useCurrentUser";
import Image from "next/image";
import Waiting from "@/live/[id]/waiting/waiting";
import Link from "next/link";
import BasicReturn from "@/components/basic-return/return";

export default function ExploreSetsPage() {
    const router = useRouter();
    const [sets, setSets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');
    const [errorOpen, setErrorOpen] = useState(false);

    const { currentUser, signedIn, userLoading } = useCurrentUser();

    const formatTimestamp = (timestamp:Timestamp) => {
        const date = new Date(timestamp.seconds * 1000);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        let interval = Math.floor(seconds / 31536000);  
        if (interval >= 1) {
            const yearsAgo = interval === 1 ? 'year' : 'years';
            return interval + " " + yearsAgo + " ago";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
            const monthsAgo = interval === 1 ? 'month' : 'months';
            return interval + " " + monthsAgo + " ago";
        }
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
            const daysAgo = interval === 1 ? 'day' : 'days';
            return interval + " " + daysAgo + " ago";
        }
        interval = Math.floor(seconds / 3600);  
        if (interval >= 1) {
            const hoursAgo = interval === 1 ? 'hour' : 'hours';
            return interval + " " + hoursAgo + " ago";
        }
        interval = Math.floor(seconds / 60);
        if (interval >= 1) {
            const minutesAgo = interval === 1 ? 'minute' : 'minutes';
            return interval + " " + minutesAgo + " ago";
        }

        const secondsAgo = seconds === 1 ? 'second' : 'seconds';
        return seconds + " " + secondsAgo + " ago";
    };

    useEffect(() => {
        (async () => {
            const setsQuery = query(collection(firestore, 'sets'), limit(20), orderBy('likes', 'desc'), where('public', '==', true));
            const docs = await getDocs(setsQuery);

            const setsArray:any[] = [];
            docs.forEach(doc => {
                setsArray.push({
                    id: doc.id,
                    name: doc.data().name,
                    likes: doc.data().likes,
                    owner: doc.data().owner,
                    numQuestions: doc.data().numQuestions,
                    createdAt: doc.data().createdAt,
                    description: doc.data().description,
                    image: doc.data().image
                });
            });

            setSets(setsArray);
            setLoading(false);
        })();
    }, []);

    if (loading) {
        return(<Loading />);
    }

    if (sets.length === 0) {
        return(<BasicReturn text="No sets are available" returnLink="/" />);
    }

    return(
        <div>
            <div className={styles.sets}>
                {sets.map((set:any, index) => {
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
                                    <p style={{ fontFamily: 'Cubano' }}>Created {formatTimestamp(set.createdAt)}</p>
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
            </div>

            <Popup open={errorOpen} setOpen={setErrorOpen} exitButton>
                <Image src='/images/icons/error.png' alt='error' width={60} height={60} style={{ marginBottom:25 }} />
                <h1 className={styles.popup_error}>{error}</h1>
            </Popup>
        </div>
    );
}