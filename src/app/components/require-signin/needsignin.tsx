'use client'

import Link from 'next/link';
import styles from './needsignin.module.css';
import { useRouter } from 'next/navigation';

export default function NeedSignin() {
    const router = useRouter();

    return (
        <div className={styles.need_signin_background}>
            <div className={styles.container}>
                <h1 className={styles.small_title}>Restricted Access</h1>
                <h1 className={styles.big_title}>You need to be signed in!</h1>
                <h1 className={styles.subtitle}>Don&apos;t miss out on all this awesome content. Please sign in!</h1>
                <div className={styles.buttons}>
                    <button className={styles.go_back} onClick={() => {
                        router.back();
                    }}>← Go Back</button>
                    <Link href='/'><button className={styles.go_home}>Go Home</button></Link>
                </div>
            </div>
        </div>
    );
}