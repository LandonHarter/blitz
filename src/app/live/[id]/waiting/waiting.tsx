'use client'

import styles from './waiting.module.css';

export default function Waiting(props:any) {
    return(
        <div className={styles.background}>
            <div className={styles.hourglass} />
            {props.children}
        </div>
    );
}