'use client'

import styles from './page.module.css';

import Image from 'next/image';
import { useRef } from 'react';

export default function JoinPage() {
    const joinInput = useRef<HTMLInputElement>(null);

    return(
        <div className={styles.background}>
            <div className={styles.content}>
                <Image src='/bigicon.png' alt="logo" width={333} height={187.5} />
                <input type="text" ref={joinInput} className={styles.join_input} placeholder="Join Code" maxLength={6} />
                <button className={styles.join_button}>Join</button>
            </div>
        </div>
    );
}