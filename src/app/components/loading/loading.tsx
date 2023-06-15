'use client'

import styles from "./loading.module.css";

// https://codepen.io/jkantner/pen/mdMydQO

export default function Loading() {
    return(
        <div className={styles.loading_background}>
            <div className={styles.book}>
                <div className={styles.book_page_shadow}></div>
                <div className={styles.book_page}></div>
                <div className={`${styles.book_page} ${styles.book_page_2}`}></div>
                <div className={`${styles.book_page} ${styles.book_page_3}`}></div>
                <div className={`${styles.book_page} ${styles.book_page_4}`}></div>
                <div className={`${styles.book_page} ${styles.book_page_5}`}></div>
            </div>
        </div>
    );
}