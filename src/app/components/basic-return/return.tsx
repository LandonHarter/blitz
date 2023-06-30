'use client'

import Link from 'next/link'
import styles from './return.module.css'

export default function BasicReturn(props:{ text:string, returnLink:string }) {
    return(
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>{props.text}</h1>
                <Link href={props.returnLink}><button className={styles.gohome}>Return</button></Link>
            </div>
        </div>
    )
}