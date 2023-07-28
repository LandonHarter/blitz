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
import UserContext from "@/context/usercontext";
import algoliasearch from "algoliasearch/lite";
import { HeartSVG } from "@/svg";
import { likeSet, unlikeSet } from "@/backend/set";
import SetCard from "@/components/set-card/setcard";

export default function ExploreContent() {
    const router = useRouter();
    const [sets, setSets] = useState<any[]>([]);
    const [loadingContent, setLoadingContent] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchClient, setSearchClient] = useState<any>(null);
    const [searchIndex, setSearchIndex] = useState<any>(null);

    const [error, setError] = useState('');
    const [errorOpen, setErrorOpen] = useState(false);

    const { currentUser, signedIn, userLoading, updateUserData } = useContext(UserContext);
    const [finishedLiking, setFinishedLiking] = useState(true);

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
                    public: doc.data().public,
                    liked: (currentUser.likedSets || {})[doc.id] || false,
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
    }, [currentUser]);

    const search = async (query: string) => {
        if (!searchClient || !searchIndex) {
            return;
        }

        setLoadingContent(true);
        const { hits } = await searchIndex.search(query);

        let filteredHits: any[] = [];
        for (let i = 0; i < hits.length; i++) {
            const hit = hits[i];
            if (hit.public) {
                filteredHits.push({
                    ...hit,
                    liked: (currentUser.likedSets || {})[hit.objectID] || false,
                });
            }
        }

        setSets(filteredHits);
        setLoadingContent(false);
    }

    if (userLoading) {
        return (<Loading />);
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
                    <Image src="/images/icons/dark/search.png" alt="search" width={30} height={30} />
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
                    </div> : <>
                        {sets.map((set: any, index) => {
                            return (<SetCard key={index} set={set} />);
                        })}

                        {(sets.length === 0 && !loadingContent) &&
                            <div className={styles.no_sets}>
                                <h1>No sets found.</h1>
                            </div>
                        }
                    </>
                }
            </div>

            <Popup open={errorOpen} setOpen={setErrorOpen} exitButton>
                <Image src='/images/icons/error.png' alt='error' width={60} height={60} style={{ marginBottom: 25 }} />
                <h1 className='popup_error'>{error}</h1>
            </Popup>
        </div>
    );
}