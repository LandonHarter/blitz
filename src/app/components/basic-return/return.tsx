'use client'

import { motion } from 'framer-motion'
import styles from './return.module.css'

export default function BasicReturn(props: { text: string, returnLink: string, others?: { text: string, link: string, newTab?: boolean }[] }) {
    return (
        <motion.div className={styles.container} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.1 }}>
            <div className={styles.content}>
                <h1 className={styles.title}>{props.text}</h1>

                <div className={styles.buttons}>
                    {props.others?.map((item, index) => {
                        return <a href={item.link} target={item.newTab ? '_blank' : '_self'} key={index}><button className={styles.gohome}>{item.text}</button></a>
                    })}
                    <a href={props.returnLink}><button className={styles.gohome}>Return</button></a>
                </div>
            </div>
        </motion.div>
    )
}