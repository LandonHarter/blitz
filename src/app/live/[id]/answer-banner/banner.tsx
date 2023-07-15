'use client'

import { motion } from 'framer-motion';
import styles from './banner.module.css';
import Image from 'next/image';

export default function AnswerBanner(props: { correct: boolean, points: number }) {
    return (
        <motion.div className={styles.banner} initial={{ height: 0 }} animate={{ height: 100 }} transition={{ duration: 0.5 }}>
            <Image src={props.correct ? '/images/icons/check.png' : '/images/icons/error.png'} alt='correct' width={50} height={50} />
            <h1 className={styles.banner_title}>{props.correct ? `Correct! +${props.points}` : 'Incorrect!'}</h1>
        </motion.div>
    );
}