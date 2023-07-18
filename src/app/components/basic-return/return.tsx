'use client'

import { motion } from 'framer-motion'
import styles from './return.module.css'

export default function BasicReturn(props: { text: string, returnLink: string }) {
    return (
        <motion.div className={styles.container} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.1 }}>
            <div className={styles.content}>
                <h1 className={styles.title}>{props.text}</h1>
                <a href={props.returnLink}><button className={styles.gohome}>Return</button></a>
            </div>
        </motion.div>
    )
}