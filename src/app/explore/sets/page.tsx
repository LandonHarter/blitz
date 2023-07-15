'use client'

import React, { useContext, useEffect, useState } from "react";

import styles from "./page.module.css";
import Loading from "@/components/loading/loading";
import { query, collection, orderBy, limit, getDocs, where, Timestamp } from "firebase/firestore";
import { firestore } from "@/backend/firebase/init";
import { createGame } from "@/backend/live/game";
import { useRouter } from "next/navigation";
import Popup from "@/components/popup/popup";
import Image from "next/image";
import Link from "next/link";
import BasicReturn from "@/components/basic-return/return";
import UserContext from "@/context/usercontext";
import { formatTimestampAgo } from "@/backend/util";
import algoliasearch from "algoliasearch/lite";

export default function ExploreSetsPage() {
    const router = useRouter();
    const [sets, setSets] = useState<any[]>([]);
    const [loadingContent, setLoadingContent] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchClient, setSearchClient] = useState<any>(null);
    const [searchIndex, setSearchIndex] = useState<any>(null);

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
                    image: doc.data().image,
                    scramble: doc.data().scramble,
                    public: doc.data().public
                });
            });
            setSets(setsArray);

            const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
            const algoliaSearchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY;

            if (!algoliaAppId || !algoliaSearchKey) {
                setError('Search is currently unavailable. Please try again later.');
                setErrorOpen(true);
                return;
            }

            const algoliaClient = algoliasearch(algoliaAppId, algoliaSearchKey);
            const algoliaIndex = algoliaClient.initIndex('sets');

            setSearchClient(algoliaClient);
            setSearchIndex(algoliaIndex);
            setLoadingContent(false);
        })();
    }, []);

    const search = async (query: string) => {
        if (!searchClient || !searchIndex) {
            return;
        }

        setLoadingContent(true);
        const { hits } = await searchIndex.search(query);
        setSets(hits);
        setLoadingContent(false);
    }

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
                <input className={styles.search} placeholder="Search for a set" value={searchQuery} onChange={(e) => {
                    setSearchQuery(e.target.value);
                }} />
                <button className={styles.search_button} onClick={() => {
                    search(searchQuery);
                }}>
                    <Image src="/images/icons/search-light.png" alt="search" width={30} height={30} />
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
                                        <p style={{ fontFamily: 'Cubano' }}>Created {formatTimestampAgo(typeof set.createdAt === "number" ? Timestamp.fromMillis(set.createdAt) : set.createdAt)}</p>
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