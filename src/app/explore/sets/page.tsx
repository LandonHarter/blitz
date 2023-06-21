'use client'

import React, { useEffect, useState } from "react";

import styles from "./page.module.css";
import Loading from "@/components/loading/loading";
import { query, collection, orderBy, limit, getDocs, where } from "firebase/firestore";
import { firestore } from "@/backend/firebase/init";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ExploreSetsPage() {
    const router = useRouter();
    const [sets, setSets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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

    return(
        <div>
            <div className={styles.sets}>
                {sets.map((set:any, index) => {
                    return(
                        <article key={index} className={styles.set_card} onClick={() => {
                            router.push(`/set/${set.id}`);
                        }}>
                            <div className={styles.article_wrapper}>
                                <figure style={{ backgroundImage: `url(${set.image})` }}>
                                    
                                </figure>
                                <div className={styles.article_body}>
                                    <h2>{set.name}</h2>
                                    <p>{set.description}</p>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>
        </div>
    );
}