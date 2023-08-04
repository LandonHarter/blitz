'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import algoliasearch from 'algoliasearch/lite';
import styles from './page.module.css';
import Popup from '@/components/popup/popup';
import Link from 'next/link';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { firestore } from '@/backend/firebase/init';

export default function CoursesContent() {
    const [courses, setCourses] = useState<any[]>([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchClient, setSearchClient] = useState<any>(null);
    const [searchIndex, setSearchIndex] = useState<any>(null);

    const [loadingContent, setLoadingContent] = useState(true);

    const [error, setError] = useState('');
    const [errorOpen, setErrorOpen] = useState(false);

    useEffect(() => {
        (async () => {
            const coursesQuery = query(collection(firestore, 'courses'), limit(30));
            const docs = await getDocs(coursesQuery);

            const coursesArray: any[] = [];
            docs.forEach(doc => {
                if (doc.id === 'empty') return;
                coursesArray.push({
                    ...doc.data(),
                    id: doc.id
                });
            });
            setCourses(coursesArray);

            const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
            const algoliaSearchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY;

            if (!algoliaAppId || !algoliaSearchKey) {
                setError('Search is currently unavailable. Please try again later.');
                setErrorOpen(true);
                return;
            }

            const algoliaClient = algoliasearch(algoliaAppId, algoliaSearchKey);
            const algoliaIndex = algoliaClient.initIndex('courses');

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

        let filteredHits: any[] = [];
        for (let i = 0; i < hits.length; i++) {
            const hit = hits[i];
            if (hit.public) {
                filteredHits.push(hit);
            }
        }

        setCourses(filteredHits);
        setLoadingContent(false);
    };

    return (
        <div className={styles.courses_page}>
            <h1 className={styles.title}>Explore Courses</h1>

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

            <div className={styles.courses}>
                {loadingContent ?
                    <div className={styles.loading_content}>
                        <div className={styles.loader}>
                            <div className={styles.dot}></div>
                            <div className={styles.dot}></div>
                            <div className={styles.dot}></div>
                        </div>
                        <h1 className={styles.loading_title}>Loading...</h1>
                    </div> : <>
                        {courses.map((course: any, index) => {
                            return (
                                <article className={styles.course_card} key={index}>
                                    <div className={styles.article_wrapper}>
                                        <figure style={{ backgroundImage: `url(${course.image})` }}>

                                        </figure>
                                        <div className={styles.article_body}>
                                            <Link href={`/course/${course.id}`} className={styles.link_decoration}><h2 onClick={() => {
                                            }}>{course.name}</h2></Link>
                                            <p>Written by {course.author}</p>
                                        </div>
                                        <div className={styles.card_footer}>

                                        </div>
                                    </div>
                                </article>
                            );
                        })}

                        {(courses.length === 0 && !loadingContent) &&
                            <div className={styles.no_sets}>
                                <h1>No courses found.</h1>
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