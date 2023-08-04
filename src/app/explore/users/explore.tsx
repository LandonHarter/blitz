'use client'

import React, { useContext, useEffect, useState } from "react";

import styles from "./page.module.css";
import Loading from "@/components/loading/loading";
import { query, collection, orderBy, limit, getDocs, where, Timestamp } from "firebase/firestore";
import { firestore } from "@/backend/firebase/init";
import Popup from "@/components/popup/popup";
import Image from "next/image";
import UserContext from "@/context/usercontext";
import algoliasearch from "algoliasearch/lite";
import SetCard from "@/components/set-card/setcard";
import { formatDate } from "@/backend/util";
import Link from "next/link";

export default function UsersExploreContent() {
    const [users, setUsers] = useState<any[]>([]);
    const [loadingContent, setLoadingContent] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchClient, setSearchClient] = useState<any>(null);
    const [searchIndex, setSearchIndex] = useState<any>(null);

    const [error, setError] = useState('');
    const [errorOpen, setErrorOpen] = useState(false);

    const { currentUser, userLoading } = useContext(UserContext);

    useEffect(() => {
        (async () => {
            const usersQuery = query(collection(firestore, 'users'), limit(30));
            const docs = await getDocs(usersQuery);

            const usersArray: any[] = [];
            docs.forEach(doc => {
                usersArray.push(doc.data());
            });
            setUsers(usersArray);

            const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
            const algoliaSearchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY;

            if (!algoliaAppId || !algoliaSearchKey) {
                setError('Search is currently unavailable. Please try again later.');
                setErrorOpen(true);
                return;
            }

            const algoliaClient = algoliasearch(algoliaAppId, algoliaSearchKey);
            const algoliaIndex = algoliaClient.initIndex('users');

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
        setUsers(hits);
        setLoadingContent(false);
    }

    if (userLoading) {
        return (<Loading />);
    }

    return (
        <div className={styles.explore}>
            <h1 className={styles.title}>Explore Users</h1>

            <div className={styles.search_container}>
                <input className={styles.search} placeholder="Search for a users" value={searchQuery} onChange={(e) => {
                    setSearchQuery(e.target.value);
                }} />
                <button className={styles.search_button} onClick={() => {
                    search(searchQuery);
                }}>
                    <Image src="/images/icons/dark/search.png" alt="search" width={30} height={30} />
                </button>
            </div>

            <div className={styles.users}>
                {loadingContent ?
                    <div className={styles.loading_content}>
                        <div className={styles.loader}>
                            <div className={styles.dot}></div>
                            <div className={styles.dot}></div>
                            <div className={styles.dot}></div>
                        </div>
                        <h1 className={styles.loading_title}>Loading...</h1>
                    </div> : <>
                        {users.map((user: any, index: number) => {
                            return (
                                <Link href={`/profile/${user.uid}`} key={index} style={{
                                    textDecoration: 'none'
                                }}>
                                    <div className={styles.user_card}>
                                        <Image src={user.pfp} alt="user pfp" width={64} height={64} className={styles.user_pfp} />
                                        <div className={styles.user_info}>
                                            <h1 className={styles.user_name}>{user.name}</h1>
                                            <p className={styles.user_old}>Joined {formatDate(new Date(user.createdAt))}</p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}

                        {(users.length === 0 && !loadingContent) &&
                            <div className={styles.no_users}>
                                <h1>No users found.</h1>
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