'use client'

import React, { useContext, useEffect, useState } from "react";

import styles from "./page.module.css";
import Loading from "@/components/loading/loading";
import { query, collection, orderBy, limit, getDocs, where } from "firebase/firestore";
import { firestore } from "@/backend/firebase/init";
import { createGame } from "@/backend/live/game";
import { useRouter } from "next/navigation";
import Popup from "@/components/popup/popup";
import Image from "next/image";
import Link from "next/link";
import BasicReturn from "@/components/basic-return/return";
import UserContext from "@/context/usercontext";
import { formatTimestampAgo } from "@/backend/util";

export default function ExploreSetsPage() {
    const router = useRouter();
    const [sets, setSets] = useState<any[]>([]);
    const [loadingContent, setLoadingContent] = useState(true);

    const [error, setError] = useState('');
    const [errorOpen, setErrorOpen] = useState(false);

    const { currentUser, signedIn, userLoading } = useContext(UserContext);

    useEffect(() => {
        (async () => {
            const setsQuery = query(collection(firestore, 'sets'), limit(30), orderBy('likes', 'desc'), where('public', '==', true));
            const docs = await getDocs(setsQuery);

            const setsArray: any[] = [];
            docs.forEach(doc => {
                setsArray.push({
                    id: doc.id,
                    name: doc.data().name,
                    likes: doc.data().likes,
                    owner: doc.data().owner,
                    ownerName: doc.data().ownerName,
                    numQuestions: doc.data().numQuestions,
                    createdAt: doc.data().createdAt,
                    description: doc.data().description,
                    image: doc.data().image
                });
            });

            setSets(setsArray);
            setLoadingContent(false);
        })();
    }, []);

    if (userLoading) {
        return (<Loading />);
    }

    if (sets.length === 0) {
        return (<BasicReturn text="No sets are available" returnLink="/" />);
    }

    return (
        <div className={styles.explore}>
            <h1 className={styles.title}>Explore Sets</h1>

            <div className={styles.search_container}>
                <input className={styles.search} placeholder="Search for a set" />
                <button className={styles.search_button}>
                    <Image src="/images/icons/search-light.png" alt="search" width={35} height={35} />
                </button>
            </div>

            <div className={styles.sets}>
                {loadingContent ?
                    <div className={styles.loading_content}>
                        <div className={styles.loader}>
                            <div className={styles.dot}></div>
                            <div className={styles.dot}></div>
                            <div className={styles.dot}></div>
                        </div>
                        <h1 className={styles.loading_title}>Loading...</h1>
                    </div> :
                    sets.map((set: any, index) => {
                        return (
                            <article key={index} className={styles.set_card}>
                                <div className={styles.article_wrapper}>
                                    <figure style={{ backgroundImage: `url(${set.image})` }}>

                                    </figure>
                                    <div className={styles.article_body}>
                                        <Link href={`/set/${set.id}`} className={styles.link_decoration}><h2 onClick={() => {
                                        }}>{set.name}</h2></Link>
                                        <p>Created by {set.ownerName}</p>
                                    </div>
                                    <div className={styles.card_footer}>
                                        <p style={{ fontFamily: 'Cubano' }}>Created {formatTimestampAgo(set.createdAt)}</p>
                                        <button onClick={async () => {
                                            if (!signedIn) {
                                                setError('You must be signed in to host a live game.');
                                                setErrorOpen(true);
                                                return;
                                            }

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
                                            }
                                        }}>Host Live</button>
                                    </div>
                                </div>
                            </article>
                        );
                    })
                }
            </div>

            <Popup open={errorOpen} setOpen={setErrorOpen} exitButton>
                <Image src='/images/icons/error.png' alt='error' width={60} height={60} style={{ marginBottom: 25 }} />
                <h1 className={styles.popup_error}>{error}</h1>
            </Popup>
        </div>
    );
}