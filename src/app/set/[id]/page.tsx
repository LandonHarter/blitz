'use client'

import { useEffect, useState } from 'react';
import styles from './page.module.css';

import { useRouter, usePathname } from 'next/navigation';
import { collection, doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/backend/firebase/init';
import { Set } from '@/backend/live/set';
import Loading from '@/components/loading/loading';

export default function SetPage() {
    const id = usePathname().split('/')[2];
    const router = useRouter();

    const [set, setSet] = useState<Set>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) {
            router.push('/');
            return;
        }

        (async () => {
            const setRef = doc(collection(firestore, 'sets'), id);
            const setData = await getDoc(setRef);

            if (!setData.exists()) {
                router.push('/');
                return;
            }

            const set = setData.data();
            setSet(set as Set);
            setLoading(false);
        })();
    }, []);

    if (loading || !set) {
        return (<Loading />);
    }

    return (
        <div>
            <h1>{set.name}</h1>
        </div>
    );
}