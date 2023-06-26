'use client'

import Link from 'next/link';
import styles from './needsignin.module.css';

export default function NeedSignin() {
    return(
        <div className={styles.need_signin_background}>
            <div className={styles.content}>
                <h1 className={styles.title}>Oops! You need to be signed in.</h1>

                <Link href='/'><button className={styles.gohome}>Return Home</button></Link>
            </div>
        </div>
    );
}