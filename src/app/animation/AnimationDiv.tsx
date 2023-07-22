'use client'

import { motion } from 'framer-motion';
import { Animation } from './animation';

export default function AnimationDiv(props: { animation: Animation, duration: number, className: string, children: any }) {
    return (
        <motion.div className={props.className} initial={props.animation.initial} animate={props.animation.animate} exit={props.animation.exit} transition={{ duration: props.duration }} >
            {props.children}
        </motion.div>
    )
}