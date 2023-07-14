'use client'

import { motion } from 'framer-motion';
import styles from './banner.module.css';
import Image from 'next/image';

export default function AnswerBanner(props: { correct: boolean }) {
    return (
        <motion.div className={styles.banner} initial={{ height: 0 }} animate={{ height: 100 }} transition={{ duration: 0.5 }}>
            <Image src={props.correct ? '/images/icons/check.png' : '/images/icons/error.png'} alt='correct' width={50} height={50} />
            <h1 className={styles.banner_title}>{props.correct ? 'Correct!' : 'Incorrect!'}</h1>
        </motion.div>
    );
}