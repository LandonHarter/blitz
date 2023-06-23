'use client'

import { usePathname } from 'next/navigation';
import styles from './page.module.css';
import { useEffect, useState } from 'react';
import Loading from '@/components/loading/loading';
import { collection, doc, getDoc } from 'firebase/firestore';
import { firestore } from '@baas/init';

export default function ProfilePage() {
    const userId = usePathname().split('/')[2];

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any|null>(null);

    useEffect(() => {
        (async () => {
            const userRef = doc(collection(firestore, 'users'), userId);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                return;
            }

            setUser(userDoc.data());
            setLoading(false);
        })();
    }, []);

    if (loading) {
        return(<Loading />);
    }

    if (!user) {
        return(<div>User does not exist</div>);
    }

    return (
        <div></div>
    );
}